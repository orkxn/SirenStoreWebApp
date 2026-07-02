using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SirenStore.Application.Interfaces;
using SirenStore.WebAPI.Extensions;

namespace SirenStore.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] 
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly IAuditLogService _auditLogService;
        private readonly ILoginHistoryService _loginHistoryService;

        public AdminController(
            IAdminService adminService,
            IAuditLogService auditLogService,
            ILoginHistoryService loginHistoryService)
        {
            _adminService = adminService;
            _auditLogService = auditLogService;
            _loginHistoryService = loginHistoryService;
        }

        // sistemdeki tüm kullanıcıları listeler
        // GET: api/admin/users
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _adminService.GetAllUsersAsync();
            return Ok(users);
        }

        // sistemdeki tüm satıcıları ve mağaza durumlarını listeler
        // GET: api/admin/sellers
        [HttpGet("sellers")]
        public async Task<IActionResult> GetAllSellers()
        {
            var sellers = await _adminService.GetAllSellersAsync();
            return Ok(sellers);
        }

        // kullanıcıyı banlar
        // POST: api/admin/users/{id}/ban
        [HttpPost("users/{id:long}/ban")]
        public async Task<IActionResult> BanUser(long id)
        {
            // adminin kendi hesabını banlamasını engellemek için kontrol parametresi
            long currentUserId = User.GetUserId();

            // servise hem isteği yapanı hem de hedeflenen kişiyi gönderiyoruz
            await _adminService.BanUserAsync(currentUserId, id);

            return Ok(new { message = "Kullanıcı başarıyla banlandı. Artık sisteme giriş yapamaz." });
        }

        // kullanıcının banını kaldırır
        // POST: api/admin/users/{id}/unban
        [HttpPost("users/{id:long}/unban")]
        public async Task<IActionResult> UnbanUser(long id)
        {
            // adminin kendi hesabını unbanlamasını engellemek için kontrol parametresi
            long currentUserId = User.GetUserId();

            // servise hem isteği yapanı hem de hedeflenen kişiyi gönderiyoruz
            await _adminService.UnbanUserAsync(currentUserId, id);

            return Ok(new { message = "Kullanıcının banı başarıyla kaldırıldı." });
        }

        // tüm işlem loglarını getirir (audit logs)
        // GET: api/admin/audit-logs
        [HttpGet("audit-logs")]
        public async Task<IActionResult> GetAuditLogs()
        {
            var logs = await _auditLogService.GetAllAuditLogsAsync();
            return Ok(logs);
        }

        // tüm giriş geçmişi kayıtlarını getirir (login history)
        // GET: api/admin/login-histories
        [HttpGet("login-histories")]
        public async Task<IActionResult> GetLoginHistories()
        {
            var histories = await _loginHistoryService.GetAllLoginHistoriesAsync();
            return Ok(histories);
        }
    }
}