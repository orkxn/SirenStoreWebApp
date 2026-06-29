using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SirenStore.Application.DTOs;
using SirenStore.Application.Interfaces;
using System.Security.Claims;

namespace SirenStore.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    // sadece giriş yapmış kullanıcılar erişebilir
    public class CustomerController : ControllerBase
    {
        private readonly IUserService _userService;

        public CustomerController(IUserService userService)
        {
            _userService = userService;
        }

        // profil bilgilerini getirme
        // GET: api/customer/profile
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            // 
            long userId = GetUserIdFromToken();

            var profile = await _userService.GetProfileAsync(userId);
            return Ok(profile);
        }

        // profil bilgilerini güncelleme
        // POST: api/customer/profile/update
        [HttpPost("profile/update")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            long userId = GetUserIdFromToken();

            await _userService.UpdateProfileAsync(userId, dto);
            return Ok(new { Message = "Profil bilgileriniz başarıyla güncellendi." });
        }

        // şifre değiştirme
        // POST: api/customer/change-password
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            long userId = GetUserIdFromToken();

            await _userService.ChangePasswordAsync(userId, dto);
            return Ok(new { Message = "Şifreniz başarıyla değiştirildi. Bir sonraki girişinizde yeni şifrenizi kullanabilirsiniz." });
        }

        // jwt token'dan kullanıcı ID'sini alma
        private long GetUserIdFromToken()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
            {
                // normalde buraya ulaşmamalı çünkü [Authorize] attribute zaten kullanıcıyı doğrular ama yine de güvenlik için kontrol ekledik
                throw new UnauthorizedAccessException("Geçersiz kullanıcı kimliği.");
            }

            return userId;
        }
    }
}