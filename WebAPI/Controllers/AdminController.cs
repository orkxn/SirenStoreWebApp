using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SirenStore.Application.Interfaces;

namespace SirenStore.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] 
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        // Sistemdeki tüm kullanıcıları listeler
        // GET: api/admin/users
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _adminService.GetAllUsersAsync();
            return Ok(users);
        }

        // Sistemdeki tüm satıcıları ve mağaza durumlarını listeler
        // GET: api/admin/sellers
        [HttpGet("sellers")]
        public async Task<IActionResult> GetAllSellers()
        {
            var sellers = await _adminService.GetAllSellersAsync();
            return Ok(sellers);
        }

        // Kullanıcıyı banlar
        // POST: api/admin/users/{id}/ban
        [HttpPost("users/{id:long}/ban")]
        public async Task<IActionResult> BanUser(long id)
        {
            // JWT token içerisinden isteği atan adminin ID'sini çekiyoruz
            var currentUserIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);

            if (currentUserIdClaim == null)
                return Unauthorized(new { message = "Geçersiz oturum. Kullanıcı kimliği doğrulanamadı." });

            long currentUserId = long.Parse(currentUserIdClaim.Value);

            // Servise hem isteği yapanı hem de hedeflenen kişiyi gönderiyoruz
            await _adminService.BanUserAsync(currentUserId, id);

            return Ok(new { message = "Kullanıcı başarıyla banlandı. Artık sisteme giriş yapamaz." });
        }

        // Kullanıcının banını kaldırır (Sisteme girişini tekrar açar)
        // POST: api/admin/users/{id}/unban
        [HttpPost("users/{id:long}/unban")]
        public async Task<IActionResult> UnbanUser(long id)
        {
            await _adminService.UnbanUserAsync(id);
            return Ok(new { message = "Kullanıcının banı başarıyla kaldırıldı." });
        }
    }
}