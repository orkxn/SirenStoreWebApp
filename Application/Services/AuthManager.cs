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

        // Validator'larımızı tanımlıyoruz
        private readonly IValidator<RegisterDto> _registerValidator;
        private readonly IValidator<LoginDto> _loginValidator;

        public AuthManager(
            IRepository<User> userRepository,
            IConfiguration configuration,
            IValidator<RegisterDto> registerValidator,   // Dependency Injection ile içeri alıyoruz
            IValidator<LoginDto> loginValidator)         // Dependency Injection ile içeri alıyoruz
        {
            _userRepository = userRepository;
            _configuration = configuration;
            _registerValidator = registerValidator;
            _loginValidator = loginValidator;
        }

        // 1. YENİ KULLANICI KAYDI
        public async Task RegisterAsync(RegisterDto dto)
        {
            // 1. ADIM: VERİ DOĞRULAMA (VALIDATION)
            // Eğer veri kurallara uymazsa, kod buradan aşağıya inmez ve ValidationException fırlatır!
            await _registerValidator.ValidateAndThrowAsync(dto);

            // 2. ADIM: İŞ KURALI (BUSINESS RULE)
            var emailExists = await _userRepository.AnyAsync(u => u.Email == dto.Email && !u.IsDeleted);
            if (emailExists)
                throw new BusinessRuleException("Bu e-posta adresi zaten sistemde kayıtlı!");

            // 3. ADIM: VERİTABANINA KAYIT
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
        }

        // 2. SİSTEME GİRİŞ YAPMA
        public async Task<TokenDto> LoginAsync(LoginDto dto)
        {
            // 1. ADIM: VERİ DOĞRULAMA (VALIDATION)
            await _loginValidator.ValidateAndThrowAsync(dto);

            // 2. ADIM: KULLANICIYI BULMA
            var user = await _userRepository.GetAsync(u => u.Email == dto.Email && !u.IsDeleted);

            if (user == null || !user.IsActive)
                throw new BusinessRuleException("E-posta adresi veya şifre hatalı.");

            // 3. ADIM: ŞİFRE DOĞRULAMA
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

            if (!isPasswordValid)
                throw new BusinessRuleException("E-posta adresi veya şifre hatalı.");

            // 4. ADIM: TOKEN ÜRETİMİ VE KAYDI
            var tokenDto = GenerateJwtToken(user);
            user.RefreshToken = tokenDto.RefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();

            return tokenDto;
        }

        // 3. TOKEN YENİLEME
        public async Task<TokenDto> RefreshTokenAsync(string refreshToken)
        {
            // Refresh token düz bir string olduğu için DTO bazlı validasyona gerek yok, 
            // null kontrolü yapıp direkt iş kuralına geçebiliriz.
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

        // 4. JWT ÜRETİCİ (Yardımcı Metot)
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

            var expires = DateTime.UtcNow.AddMinutes(double.Parse(_configuration["JwtSettings:DurationInMinutes"] ?? "60"));

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