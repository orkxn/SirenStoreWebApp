using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SirenStore.Application.DTOs;
using SirenStore.Application.Services;
using SirenStore.WebAPI.Extensions;
using System.Security.Claims;

namespace SirenStore.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    // sadece giriş yapmış kullanıcılar erişebilir
    public class CustomerController : ControllerBase
    {
        private readonly UserService _userService;

        public CustomerController(UserService userService)
        {
            _userService = userService;
        }

        // profil bilgilerini getirme
        // GET: api/customer/profile
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            // 
            long userId = User.GetUserId();

            var profile = await _userService.GetProfileAsync(userId);
            return Ok(profile);
        }

        // profil bilgilerini güncelleme
        // POST: api/customer/profile/update
        [HttpPost("profile/update")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            long userId = User.GetUserId();

            await _userService.UpdateProfileAsync(userId, dto);
            return Ok(new { Message = "Profil bilgileriniz başarıyla güncellendi." });
        }

        // şifre değiştirme
        // POST: api/customer/change-password
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            long userId = User.GetUserId();

            await _userService.ChangePasswordAsync(userId, dto);
            return Ok(new { Message = "Şifreniz başarıyla değiştirildi. Bir sonraki girişinizde yeni şifrenizi kullanabilirsiniz." });
        }
    }
}