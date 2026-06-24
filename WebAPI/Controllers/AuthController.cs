using Microsoft.AspNetCore.Mvc;
using SirenStore.Application.DTOs;
using SirenStore.Application.Interfaces;

namespace SirenStore.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // api/auth
    public class AuthController(IAuthService authService) : ControllerBase
    {
        // 1. YENİ KULLANICI KAYDI
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            await authService.RegisterAsync(dto);

            // Başarılı kayıtta 201 Created dönüyoruz
            return StatusCode(201, new { Message = "Kayıt işlemi başarıyla tamamlandı. Artık giriş yapabilirsiniz." });
        }

        // 2. SİSTEME GİRİŞ YAPMA (LOGIN)
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            // Eğer giriş başarılıysa, servis bize TokenDto dönecek
            var tokenResult = await authService.LoginAsync(dto);

            // Token paketini doğrudan 200 OK ile müşteriye veriyoruz
            return Ok(tokenResult);
        }

        // 3. JWT TOKEN YENİLEME
        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] string refreshToken)
        {
            var result = await authService.RefreshTokenAsync(refreshToken);
            return Ok(result);
        }
    }
}