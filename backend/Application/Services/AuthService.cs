using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using BCrypt.Net;
using Entities.Enums;
using Entities.Models;
using SirenStore.Application.DTOs;
using SirenStore.Application.Exceptions;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace SirenStore.Application.Services
{
    public class AuthService
    {
        private readonly DbContext _context;
        private readonly IConfiguration _configuration;
        private readonly AuditLogService _auditLogService;
        private readonly EmailService _emailService;
        private readonly LoginHistoryService _loginHistoryService;
        private readonly IValidator<RegisterDto> _registerValidator;
        private readonly IValidator<LoginDto> _loginValidator;
        private readonly IValidator<VerifyEmailDto> _verifyEmailValidator;
        private readonly IValidator<ResendVerificationEmailDto> _resendEmailValidator;
        private readonly IValidator<ForgotPasswordDto> _forgotPasswordValidator;
        private readonly IValidator<ResetPasswordDto> _resetPasswordValidator;

        public AuthService(
            DbContext context,
            IConfiguration configuration,
            AuditLogService auditLogService,
            EmailService emailService,
            LoginHistoryService loginHistoryService,
            IValidator<RegisterDto> registerValidator,
            IValidator<LoginDto> loginValidator,
            IValidator<VerifyEmailDto> verifyEmailValidator,
            IValidator<ResendVerificationEmailDto> resendEmailValidator,
            IValidator<ForgotPasswordDto> forgotPasswordValidator,
            IValidator<ResetPasswordDto> resetPasswordValidator)
        {
            _context = context;
            _configuration = configuration;
            _auditLogService = auditLogService;
            _emailService = emailService;
            _loginHistoryService = loginHistoryService;
            _registerValidator = registerValidator;
            _loginValidator = loginValidator;
            _verifyEmailValidator = verifyEmailValidator;
            _resendEmailValidator = resendEmailValidator;
            _forgotPasswordValidator = forgotPasswordValidator;
            _resetPasswordValidator = resetPasswordValidator;
        }

        // yeni kullanıcı kaydı
        public async Task RegisterAsync(RegisterDto dto)
        {
            await _registerValidator.ValidateAndThrowAsync(dto);

            var emailExists = await _context.Set<User>().AnyAsync(u => u.Email == dto.Email && !u.IsDeleted);
            if (emailExists)
                throw new BusinessRuleException("Bu e-posta adresi zaten sistemde kayıtlı!");

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

            await _context.Set<User>().AddAsync(user);
            await _context.SaveChangesAsync();

            await _auditLogService.LogAuditAsync(user.Id, "USER_REGISTERED", "User", user.Id, $"Email: {user.Email}");
        }

        // sisteme giriş (login)
        public async Task<TokenDto> LoginAsync(LoginDto dto, string ipAddress, string? userAgent)
        {
            await _loginValidator.ValidateAndThrowAsync(dto);

            var user = await _context.Set<User>().FirstOrDefaultAsync(u => u.Email == dto.Email && !u.IsDeleted);

            if (user == null || !user.IsActive)
                throw new BusinessRuleException("E-posta adresi veya şifre hatalı.");

            if (!user.IsEmailConfirmed)
            {
                await _loginHistoryService.RecordLoginAttemptAsync(user.Id, ipAddress, userAgent, false, "E-posta doğrulanmamış");
                throw new EmailNotConfirmedException(user.Email, "Lütfen giriş yapmadan önce e-posta adresinizi doğrulayın.");
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

            if (!isPasswordValid)
            {
                await _loginHistoryService.RecordLoginAttemptAsync(user.Id, ipAddress, userAgent, false, "Hatalı şifre");
                throw new BusinessRuleException("E-posta adresi veya şifre hatalı.");
            }

            var tokenDto = GenerateJwtToken(user);
            user.RefreshToken = tokenDto.RefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

            await _context.SaveChangesAsync();

            await _loginHistoryService.RecordLoginAttemptAsync(user.Id, ipAddress, userAgent, true);
            await _auditLogService.LogAuditAsync(user.Id, "USER_LOGIN", "User", user.Id, $"Email: {user.Email}");

            return tokenDto;
        }

        // token yenileme (refresh token)
        public async Task<TokenDto> RefreshTokenAsync(string refreshToken)
        {
            if (string.IsNullOrWhiteSpace(refreshToken))
                throw new BusinessRuleException("Refresh token boş olamaz.");

            var user = await _context.Set<User>().FirstOrDefaultAsync(u => u.RefreshToken == refreshToken && !u.IsDeleted);

            if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
                throw new BusinessRuleException("Oturum süreniz dolmuş veya geçersiz istek. Lütfen tekrar giriş yapın.");

            var tokenDto = GenerateJwtToken(user);

            user.RefreshToken = tokenDto.RefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

            await _context.SaveChangesAsync();

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
        public async Task<TokenDto> VerifyEmailAsync(VerifyEmailDto dto)
        {
            await _verifyEmailValidator.ValidateAndThrowAsync(dto);

            var user = await _context.Set<User>().FirstOrDefaultAsync(u => u.Email == dto.Email && !u.IsDeleted);

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

            var tokenDto = GenerateJwtToken(user);
            user.RefreshToken = tokenDto.RefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

            await _context.SaveChangesAsync();

            await _auditLogService.LogAuditAsync(user.Id, "USER_EMAIL_VERIFIED", "User", user.Id, $"Email: {user.Email}");

            return tokenDto;
        }

        private static string BuildVerificationEmailHtml(User user, string messageText, string tokenLabelText) => $@"
<div style=""font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1a202c;"">
    <div style=""text-align: center; margin-bottom: 25px; user-select: none;"">
        <span style=""font-size: 26px; font-weight: 800; color: #09090b; letter-spacing: -1.5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"">SIREN</span><span style=""font-size: 26px; font-weight: 800; color: #ffffff; background-color: #09090b; padding: 2px 14px; border-radius: 9999px; margin-left: 5px; display: inline-block; letter-spacing: -1.5px; text-transform: uppercase; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"">STORE</span>
    </div>
    <div style=""border-top: 1px solid #e2e8f0; padding-top: 25px;"">
        <p style=""font-size: 16px; line-height: 1.5; margin-bottom: 15px;"">Merhaba <strong>{user.FirstName} {user.LastName}</strong>,</p>
        <p style=""font-size: 15px; line-height: 1.6; color: #4a5568; margin-bottom: 25px;"">{messageText}</p>
        
        <p style=""font-size: 14px; color: #4a5568; margin-bottom: 5px;"">{tokenLabelText}</p>
        <div style=""background-color: #f8fafc; padding: 16px; border-radius: 10px; border: 1px dashed #cbd5e1; font-family: monospace; font-size: 20px; font-weight: bold; text-align: center; letter-spacing: 3px; color: #1e293b; margin: 20px 0;"">
            {user.EmailVerificationToken}
        </div>
        
        <p style=""font-size: 12px; color: #94a3b8; margin-top: 35px; border-top: 1px solid #f1f5f9; padding-top: 15px;"">
            Eğer bu işlemi siz gerçekleştirmediyseniz, bu e-postayı yok sayabilirsiniz.
        </p>
    </div>
</div>";

        private async Task SendVerificationEmailInternalAsync(string email, string subject, string messageText, string tokenLabelText, string auditAction)
        {
            var user = await _context.Set<User>().FirstOrDefaultAsync(u => u.Email == email && !u.IsDeleted);

            if (user == null)
                throw new BusinessRuleException("Kullanıcı bulunamadı.");

            if (user.IsEmailConfirmed)
                throw new BusinessRuleException("E-posta adresi zaten doğrulanmış.");

            user.EmailVerificationToken = Random.Shared.Next(100000, 1000000).ToString();
            user.EmailVerificationTokenExpiry = DateTime.UtcNow.AddHours(24);

            await _context.SaveChangesAsync();

            var body = BuildVerificationEmailHtml(user, messageText, tokenLabelText);
            await _emailService.SendEmailAsync(user.Email, subject, body);

            await _auditLogService.LogAuditAsync(user.Id, auditAction, "User", user.Id, $"Email: {user.Email}");
        }

        // ilk doğrulama e-postası gönderme
        public async Task SendVerificationEmailAsync(ResendVerificationEmailDto dto)
        {
            await _resendEmailValidator.ValidateAndThrowAsync(dto);

            await SendVerificationEmailInternalAsync(
                dto.Email,
                "SirenStore - E-posta Doğrulama Kodu",
                "SIRENSTORE'a hoş geldiniz! Hesabınızı aktifleştirmek için lütfen aşağıdaki doğrulama kodunu uygulamaya girin:",
                "Tek kullanımlık doğrulama kodunuz:",
                "USER_VERIFICATION_SENT"
            );
        }

        // doğrulama e-postasını tekrar gönderme
        public async Task ResendVerificationEmailAsync(ResendVerificationEmailDto dto)
        {
            await _resendEmailValidator.ValidateAndThrowAsync(dto);

            await SendVerificationEmailInternalAsync(
                dto.Email,
                "SirenStore - Yeni Doğrulama Kodu",
                "Hesabınızı aktifleştirmek için yeni bir doğrulama kodu talebinde bulundunuz. Lütfen aşağıdaki doğrulama kodunu uygulamaya girin:",
                "Uygulama üzerinden girebileceğiniz yeni tek kullanımlık doğrulama kodunuz:",
                "USER_VERIFICATION_RESENT"
            );
        }

        // şifremi unuttum akışı - e-posta gönderimi
        public async Task ForgotPasswordAsync(ForgotPasswordDto dto)
        {
            await _forgotPasswordValidator.ValidateAndThrowAsync(dto);

            var user = await _context.Set<User>().FirstOrDefaultAsync(u => u.Email == dto.Email && !u.IsDeleted);
            if (user == null)
            {
                return;
            }

            user.PasswordResetToken = Guid.NewGuid().ToString("N");
            user.PasswordResetTokenExpiry = DateTime.UtcNow.AddHours(1);

            await _context.SaveChangesAsync();

            var clientUrl = _configuration["AppSettings:ClientUrl"] ?? "http://localhost:4200";
            var resetLink = $"{clientUrl}/reset-password?token={user.PasswordResetToken}&email={Uri.EscapeDataString(user.Email)}";
            var subject = "SirenStore - Şifre Sıfırlama Talebi";
            var body = $@"
<div style=""font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1a202c;"">
    <div style=""text-align: center; margin-bottom: 25px; user-select: none;"">
        <span style=""font-size: 26px; font-weight: 800; color: #09090b; letter-spacing: -1.5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"">SIREN</span><span style=""font-size: 26px; font-weight: 800; color: #ffffff; background-color: #09090b; padding: 2px 14px; border-radius: 9999px; margin-left: 5px; display: inline-block; letter-spacing: -1.5px; text-transform: uppercase; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"">STORE</span>
    </div>
    <div style=""border-top: 1px solid #e2e8f0; padding-top: 25px;"">
        <p style=""font-size: 16px; line-height: 1.5; margin-bottom: 15px;"">Merhaba <strong>{user.FirstName} {user.LastName}</strong>,</p>
        <p style=""font-size: 15px; line-height: 1.6; color: #4a5568; margin-bottom: 25px;"">Hesabınızın şifresini sıfırlamak için bir talepte bulundunuz. Şifrenizi sıfırlamak için lütfen aşağıdaki butona tıklayın:</p>
        
        <div style=""text-align: center; margin: 30px 0;"">
            <a href=""{resetLink}"" style=""background-color: #09090b; color: #ffffff; padding: 12px 30px; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);"">Şifremi Sıfırla</a>
        </div>

        <p style=""font-size: 13px; color: #71717a; line-height: 1.5; margin-bottom: 10px;"">Eğer yukarıdaki buton çalışmıyorsa aşağıdaki bağlantıyı tarayıcınıza kopyalayabilirsiniz:</p>
        <p style=""font-size: 12px; color: #2563eb; word-break: break-all; margin-bottom: 25px;""><a href=""{resetLink}"">{resetLink}</a></p>
        
        <p style=""font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 15px; margin-top: 20px;"">
            Bu bağlantı 1 saat boyunca geçerlidir. Eğer bu talebi siz gerçekleştirmediyseniz, hesabınız güvendedir ve bu e-postayı yok sayabilirsiniz.
        </p>
    </div>
</div>";

            await _emailService.SendEmailAsync(user.Email, subject, body);

            await _auditLogService.LogAuditAsync(user.Id, "PASSWORD_RESET_REQUESTED", "User", user.Id, $"Email: {user.Email}");
        }

        // yeni şifrenin kaydedilmesi
        public async Task ResetPasswordAsync(ResetPasswordDto dto)
        {
            await _resetPasswordValidator.ValidateAndThrowAsync(dto);

            var user = await _context.Set<User>().FirstOrDefaultAsync(u => u.Email == dto.Email && !u.IsDeleted);
            if (user == null || user.PasswordResetToken != dto.Token || user.PasswordResetTokenExpiry == null || user.PasswordResetTokenExpiry < DateTime.UtcNow)
            {
                throw new BusinessRuleException("Geçersiz veya süresi dolmuş şifre sıfırlama talebi.");
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            user.PasswordResetToken = null;
            user.PasswordResetTokenExpiry = null;

            await _context.SaveChangesAsync();

            await _auditLogService.LogAuditAsync(user.Id, "PASSWORD_RESET_COMPLETED", "User", user.Id, $"Email: {user.Email}");
        }
    }
}