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

        public AuthManager(
            IRepository<User> userRepository,
            IConfiguration configuration,
            IValidator<RegisterDto> registerValidator,   
            IValidator<LoginDto> loginValidator,
            IAuditLogService auditLogService)         
        {
            _userRepository = userRepository;
            _configuration = configuration;
            _registerValidator = registerValidator;
            _loginValidator = loginValidator;
            _auditLogService = auditLogService;
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
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            // audit: Log successful registration
            await _auditLogService.LogAuditAsync(user.Id, "USER_REGISTERED", "User", user.Id, $"Email: {user.Email}");
        }

        // sisteme giriş (login)
        public async Task<TokenDto> LoginAsync(LoginDto dto)
        {
            // validator
            await _loginValidator.ValidateAndThrowAsync(dto);

            // kullanıcıyı email ile bulma ve aktiflik kontrolü
            var user = await _userRepository.GetAsync(u => u.Email == dto.Email && !u.IsDeleted);

            if (user == null || !user.IsActive)
                throw new BusinessRuleException("E-posta adresi veya şifre hatalı.");

            // şifre doğrulama (hash karşılaştırması)
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

            if (!isPasswordValid)
                throw new BusinessRuleException("E-posta adresi veya şifre hatalı.");

            // token üretimi ve refresh token ayarlaması
            var tokenDto = GenerateJwtToken(user);
            user.RefreshToken = tokenDto.RefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();

            // audit: Log successful login
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
    }
}