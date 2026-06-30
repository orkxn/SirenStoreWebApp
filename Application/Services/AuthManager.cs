using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using BCrypt.Net;
using Entities.Enums;
using Entities.Models;
using SirenStore.Application.DTOs;
using SirenStore.Application.Exceptions;
using SirenStore.Application.Interfaces;
using FluentValidation;

namespace SirenStore.Application.Services
{
    public class AuthManager : IAuthService
    {
        private readonly IRepository<User> _userRepository;
        private readonly IConfiguration _configuration;
        private readonly IAuditLogService _auditLogService;
        private readonly IValidator<RegisterDto> _registerValidator;
        private readonly IValidator<LoginDto> _loginValidator;
        private readonly IEmailService _emailService;
        private readonly IValidator<VerifyEmailDto> _verifyEmailValidator;
        private readonly IValidator<ResendVerificationEmailDto> _resendVerificationValidator;
        private readonly ILoginHistoryService _loginHistoryService;

        public AuthManager(
            IRepository<User> userRepository,
            IConfiguration configuration,
            IValidator<RegisterDto> registerValidator,
            IValidator<LoginDto> loginValidator,
            IAuditLogService auditLogService,
            IEmailService emailService,
            IValidator<VerifyEmailDto> verifyEmailValidator,
            IValidator<ResendVerificationEmailDto> resendVerificationValidator,
            ILoginHistoryService loginHistoryService)
        {
            _userRepository = userRepository;
            _configuration = configuration;
            _registerValidator = registerValidator;
            _loginValidator = loginValidator;
            _auditLogService = auditLogService;
            _emailService = emailService;
            _verifyEmailValidator = verifyEmailValidator;
            _resendVerificationValidator = resendVerificationValidator;
            _loginHistoryService = loginHistoryService;
        }

        // yeni kullanıcı kaydı
        public async Task RegisterAsync(RegisterDto dto)
        {
            // validator kullanarak veri doğrulama
            await _registerValidator.ValidateAndThrowAsync(dto);

            // business rule: email unique olmalı
            var emailExists = await _userRepository.AnyAsync(u => u.Email == dto.Email && !u.IsDeleted);
            if (emailExists)
                throw new BusinessRuleException("Bu e-posta adresi zaten sistemde kayıtlı!");

            // database kaydı için User entity'si oluşturma ve password hashleme
            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                UserType = UserTypes.Customer,
                IsActive = true,
                IsEmailConfirmed = false,
                EmailVerificationToken = null,
                EmailVerificationTokenExpiry = null,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            // audit: Log successful registration
            await _auditLogService.LogAuditAsync(user.Id, "USER_REGISTERED", "User", user.Id, $"Email: {user.Email}");
        }

        // sisteme giriş (login)
        public async Task<TokenDto> LoginAsync(LoginDto dto, string ipAddress, string? userAgent)
        {
            // validator
            await _loginValidator.ValidateAndThrowAsync(dto);

            // kullanıcıyı email ile bulma ve aktiflik kontrolü
            var user = await _userRepository.GetAsync(u => u.Email == dto.Email && !u.IsDeleted);

            if (user == null || !user.IsActive)
                throw new BusinessRuleException("E-posta adresi veya şifre hatalı.");

            if (!user.IsEmailConfirmed)
            {
                await _loginHistoryService.RecordLoginAttemptAsync(user.Id, ipAddress, userAgent, false, "E-posta doğrulanmamış");
                throw new EmailNotConfirmedException(user.Email, "Lütfen giriş yapmadan önce e-posta adresinizi doğrulayın.");
            }

            // şifre doğrulama (hash karşılaştırması)
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

            if (!isPasswordValid)
            {
                await _loginHistoryService.RecordLoginAttemptAsync(user.Id, ipAddress, userAgent, false, "Hatalı şifre");
                throw new BusinessRuleException("E-posta adresi veya şifre hatalı.");
            }

            // token üretimi ve refresh token ayarlaması
            var tokenDto = GenerateJwtToken(user);
            user.RefreshToken = tokenDto.RefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();

            await _loginHistoryService.RecordLoginAttemptAsync(user.Id, ipAddress, userAgent, true);
            await _auditLogService.LogAuditAsync(user.Id, "USER_LOGIN", "User", user.Id, $"Email: {user.Email}");

            return tokenDto;
        }

        // token yenileme (refresh token)
        public async Task<TokenDto> RefreshTokenAsync(string refreshToken)
        {
            if (string.IsNullOrWhiteSpace(refreshToken))
                throw new BusinessRuleException("Refresh token boş olamaz.");

            var user = await _userRepository.GetAsync(u => u.RefreshToken == refreshToken && !u.IsDeleted);

            if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
                throw new BusinessRuleException("Oturum süreniz dolmuş veya geçersiz istek. Lütfen tekrar giriş yapın.");

            var tokenDto = GenerateJwtToken(user);

            user.RefreshToken = tokenDto.RefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();

            return tokenDto;
        }

        // jwt üretici
        private TokenDto GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var key = Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]
                ?? throw new InvalidOperationException("SecretKey bulunamadı!"));

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Email, user.Email),
                new(ClaimTypes.Role, user.UserType.ToString()),
                new("FirstName", user.FirstName),
                new("LastName", user.LastName)
            };

            if (!double.TryParse(_configuration["JwtSettings:DurationInMinutes"], out double durationInMinutes))
                durationInMinutes = 60;

            var expires = DateTime.UtcNow.AddMinutes(durationInMinutes);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = expires,
                Issuer = _configuration["JwtSettings:Issuer"],
                Audience = _configuration["JwtSettings:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var accessToken = tokenHandler.WriteToken(token);
            var refreshToken = Guid.NewGuid().ToString("N");

            return new TokenDto(accessToken, expires, refreshToken);
        }

        // e-posta doğrulama
        public async Task VerifyEmailAsync(VerifyEmailDto dto)
        {
            await _verifyEmailValidator.ValidateAndThrowAsync(dto);

            var user = await _userRepository.GetAsync(u => u.Email == dto.Email && !u.IsDeleted);

            if (user == null)
                throw new BusinessRuleException("Kullanıcı bulunamadı.");

            if (user.IsEmailConfirmed)
                throw new BusinessRuleException("E-posta adresi zaten doğrulanmış.");

            if (user.EmailVerificationToken != dto.Token)
                throw new BusinessRuleException("Geçersiz doğrulama kodu.");

            if (user.EmailVerificationTokenExpiry < DateTime.UtcNow)
                throw new BusinessRuleException("Doğrulama kodunun süresi dolmuş. Lütfen yeni bir kod talep edin.");

            user.IsEmailConfirmed = true;
            user.EmailVerificationToken = null;
            user.EmailVerificationTokenExpiry = null;

            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();

            // audit: Log email confirmation
            await _auditLogService.LogAuditAsync(user.Id, "USER_EMAIL_VERIFIED", "User", user.Id, $"Email: {user.Email}");
        }

        // doğrulama e-postasını tekrar gönderme
        public async Task ResendVerificationEmailAsync(ResendVerificationEmailDto dto)
        {
            await _resendVerificationValidator.ValidateAndThrowAsync(dto);

            var user = await _userRepository.GetAsync(u => u.Email == dto.Email && !u.IsDeleted);

            if (user == null)
                throw new BusinessRuleException("Kullanıcı bulunamadı.");

            if (user.IsEmailConfirmed)
                throw new BusinessRuleException("E-posta adresi zaten doğrulanmış.");

            user.EmailVerificationToken = Guid.NewGuid().ToString("N");
            user.EmailVerificationTokenExpiry = DateTime.UtcNow.AddHours(24);

            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();

            var clientUrl = _configuration["AppSettings:ClientUrl"] ?? "http://localhost:4200";
            var verificationLink = $"{clientUrl}/verify-email?token={user.EmailVerificationToken}";
            var subject = "SirenStore - Yeni Doğrulama Kodu";
            var body = $@"
<div style=""font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1a202c;"">
    <div style=""text-align: center; margin-bottom: 25px; user-select: none;"">
        <span style=""font-size: 26px; font-weight: 800; color: #09090b; letter-spacing: -1.5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"">SIREN</span><span style=""font-size: 26px; font-weight: 800; color: #ffffff; background-color: #09090b; padding: 2px 14px; border-radius: 9999px; margin-left: 5px; display: inline-block; letter-spacing: -1.5px; text-transform: uppercase; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"">STORE</span>
    </div>
    <div style=""border-top: 1px solid #e2e8f0; padding-top: 25px;"">
        <p style=""font-size: 16px; line-height: 1.5; margin-bottom: 15px;"">Merhaba <strong>{user.FirstName} {user.LastName}</strong>,</p>
        <p style=""font-size: 15px; line-height: 1.6; color: #4a5568; margin-bottom: 25px;"">Hesabınızı aktifleştirmek için yeni bir doğrulama kodu talebinde bulundunuz. Lütfen aşağıdaki doğrulama kodunu uygulamaya girin:</p>
        
        <p style=""font-size: 14px; color: #4a5568; margin-bottom: 5px;"">Uygulama üzerinden girebileceğiniz yeni tek kullanımlık doğrulama kodunuz:</p>
        <div style=""background-color: #f8fafc; padding: 16px; border-radius: 10px; border: 1px dashed #cbd5e1; font-family: monospace; font-size: 20px; font-weight: bold; text-align: center; letter-spacing: 3px; color: #1e293b; margin: 20px 0;"">
            {user.EmailVerificationToken}
        </div>
        
        <p style=""font-size: 12px; color: #94a3b8; margin-top: 35px; border-top: 1px solid #f1f5f9; padding-top: 15px;"">
            Eğer bu talebi siz gerçekleştirmediyseniz, hesabınız güvendedir ve bu e-postayı yok sayabilirsiniz.
        </p>
    </div>
</div>";

            await _emailService.SendEmailAsync(user.Email, subject, body);

            // audit: Log verification email resend
            await _auditLogService.LogAuditAsync(user.Id, "USER_VERIFICATION_RESENT", "User", user.Id, $"Email: {user.Email}");
        }
    }
}