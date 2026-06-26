using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SirenStore.Application.DTOs;
using SirenStore.Application.Interfaces;
using System.Security.Claims;

namespace SirenStore.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // Sadece sisteme giriş yapmış "Customer" rolündeki kullanıcılar bu kapıdan geçebilir!
    [Authorize]
    public class CustomerController : ControllerBase
    {
        private readonly IUserService _userService;

        public CustomerController(IUserService userService)
        {
            _userService = userService;
        }

        // 1. PROFİL BİLGİLERİNİ GETİRME
        // GET: api/customer/profile
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            // Token'ın içindeki NameIdentifier (ID) claim'ini bulup güvenli bir şekilde long'a çeviriyoruz
            long userId = GetUserIdFromToken();

            var profile = await _userService.GetProfileAsync(userId);
            return Ok(profile);
        }

        // 2. PROFİL BİLGİLERİNİ GÜNCELLEME
        // POST: api/customer/profile/update
        [HttpPost("profile/update")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            long userId = GetUserIdFromToken();

            await _userService.UpdateProfileAsync(userId, dto);
            return Ok(new { Message = "Profil bilgileriniz başarıyla güncellendi." });
        }

        // 3. ŞİFRE DEĞİŞTİRME
        // POST: api/customer/change-password
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            long userId = GetUserIdFromToken();

            await _userService.ChangePasswordAsync(userId, dto);
            return Ok(new { Message = "Şifreniz başarıyla değiştirildi. Bir sonraki girişinizde yeni şifrenizi kullanabilirsiniz." });
        }

        // Yardımcı Metot: Token'dan ID sökme işlemini tek merkezden yapıyoruz
        private long GetUserIdFromToken()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
            {
                // Teoride buraya düşmemesi gerekir çünkü [Authorize] var ama güvenlik için her zaman kontrol iyidir.
                throw new UnauthorizedAccessException("Geçersiz kullanıcı kimliği.");
            }

            return userId;
        }
    }
}