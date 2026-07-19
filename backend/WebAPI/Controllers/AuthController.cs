using Microsoft.AspNetCore.Mvc;
using SirenStore.Application.DTOs;
using SirenStore.Application.Services;

namespace SirenStore.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // api/auth
    public class AuthController(AuthService authService) : ControllerBase
    {
        // sisteme kayıt olma endpointi
        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            await authService.RegisterAsync(dto);

            // başarılı kayıtta 201 Created dönüyoruz
            return StatusCode(201, new { Message = "Kayıt işlemi başarıyla tamamlandı. Artık giriş yapabilirsiniz." });
        }

        // sisteme giriş yapma endpointi
        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            // istek yapanın ip bilgisini yakalıyoruz
            string ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Bilinmiyor";

            // tarayıcı/cihaz bilgisini yakalıyoruz
            string? userAgent = Request.Headers.UserAgent.ToString();
            
            // Eğer giriş başarılıysa, servis bize TokenDto dönecek
            var tokenResult = await authService.LoginAsync(dto, ipAddress, userAgent);

            // Token paketini doğrudan 200 OK ile müşteriye veriyoruz { accesstoken, accestokenexpdate, refreshtoken }
            return Ok(tokenResult);
        }

        // sistemdeki refresh token ile yeni access token alma endpointi
        // POST: api/auth/refresh
        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] string refreshToken)
        {
            var result = await authService.RefreshTokenAsync(refreshToken);
            return Ok(result);
        }

        // e-posta doğrulama endpointi
        // POST: api/auth/verify-email
        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailDto dto)
        {
            var tokenResult = await authService.VerifyEmailAsync(dto);
            return Ok(tokenResult);
        }

        // e-posta doğrulama kodunu tekrar gönderme endpointi
        // POST: api/auth/resend-verification-email
        [HttpPost("resend-verification-email")]
        public async Task<IActionResult> ResendVerificationEmail([FromBody] ResendVerificationEmailDto dto)
        {
            await authService.ResendVerificationEmailAsync(dto);
            return Ok(new { Message = "Doğrulama e-postası tekrar gönderildi." });
        }

        // şifremi unuttum endpointi
        // POST: api/auth/forgot-password
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            await authService.ForgotPasswordAsync(dto);
            return Ok(new { Message = "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi." });
        }

        // şifreyi sıfırlama endpointi
        // POST: api/auth/reset-password
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            await authService.ResetPasswordAsync(dto);
            return Ok(new { Message = "Şifreniz başarıyla güncellendi. Yeni şifrenizle giriş yapabilirsiniz." });
        }
    }
}