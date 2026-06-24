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

namespace SirenStore.Application.Services
{
    public class AuthManager : IAuthService
    {
        private readonly IRepository<User> _userRepository;
        private readonly IConfiguration _configuration;

        public AuthManager(IRepository<User> userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }
        // 1. YENİ KULLANICI KAYDI
        public async Task RegisterAsync(RegisterDto dto)
        {
            // İş Kuralı: Bu e-posta ile daha önce kayıt olunmuş mu?
            var emailExists = await _userRepository.AnyAsync(u => u.Email == dto.Email && !u.IsDeleted);
            if (emailExists)
                throw new BusinessRuleException("Bu e-posta adresi zaten sistemde kayıtlı!");

            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                UserType = UserTypes.Customer, // İlk kaydolan herkes varsayılan olarak Müşteridir!
                IsActive = true,
                IsEmailConfirmed = false,

                // ŞİFREYİ KRİPTOLAYARAK KAYDEDİYORUZ (BCrypt)
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();
        }

        // 2. SİSTEME GİRİŞ YAPMA
        public async Task<TokenDto> LoginAsync(LoginDto dto)
        {
            // Kullanıcıyı e-posta adresinden bul
            var user = await _userRepository.GetAsync(u => u.Email == dto.Email && !u.IsDeleted);

            if (user == null || !user.IsActive)
                throw new BusinessRuleException("E-posta adresi veya şifre hatalı."); // Güvenlik için hangisinin hatalı olduğunu söylemiyoruz

            // ŞİFRE DOĞRULAMA: Girdiği düz şifre ile veritabanındaki Hash'li şifre eşleşiyor mu?
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

            if (!isPasswordValid)
                throw new BusinessRuleException("E-posta adresi veya şifre hatalı.");

            // 1. Token paketini (Access + Refresh) üret
            var tokenDto = GenerateJwtToken(user);

            // 2. Üretilen refresh token bilgilerini veritabanındaki kullanıcıya işle
            user.RefreshToken = tokenDto.RefreshToken;
            // Refresh token 7 gün boyunca geçerli olsun (İsteğe göre değiştirebilirsin)
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

            // 3. Kullanıcı kaydını veritabanında güncelle
            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();

            // 4. İstemciye (Postman/Arayüz) token'ları fırlat
            return tokenDto;
        }

        // JWT Üretici Yardımcı Metot (Şimdilik taslak, içini birazdan dolduracağız)
        private TokenDto GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            // Program.cs'e bağladığımız gizli anahtarımızı configuration'dan çekiyoruz
            var key = Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]
                ?? throw new InvalidOperationException("SecretKey bulunamadı!"));

            // Token içerisine kullanıcının kimlik ve rol bilgilerini (Claims) ekiyoruz
            var claims = new List<Claim>
    {
        new(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new(ClaimTypes.Email, user.Email),
        new(ClaimTypes.Role, user.UserType.ToString()), // Admin, Customer, Seller vb.
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
            // Simple refresh token generation - can be replaced with a more secure approach
            var refreshToken = Guid.NewGuid().ToString("N");

            return new TokenDto(accessToken, expires, refreshToken);
        }
    }
}