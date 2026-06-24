using Microsoft.AspNetCore.Mvc;
using SirenStore.Application.Interfaces;

namespace SirenStore.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // api/admin
    public class AdminController(IAdminService adminService) : ControllerBase
    {
        // Satıcı Onaylama
        [HttpPatch("sellers/{id}/approve")]
        public async Task<IActionResult> ApproveSeller(long id)
        {
            await adminService.ApproveSellerAsync(id);
            return Ok(new { Message = "Mağaza başarıyla onaylandı." });
        }

        // Satıcı Soft Delete
        [HttpDelete("sellers/{id}")]
        public async Task<IActionResult> SoftDeleteSeller(long id)
        {
            await adminService.SoftDeleteSellerAsync(id);
            return Ok(new { Message = "Satıcı hesabı başarıyla soft-delete edildi." });
        }

        // Ürün Soft Delete
        [HttpDelete("products/{id}")]
        public async Task<IActionResult> SoftDeleteProduct(long id)
        {
            await adminService.SoftDeleteProductAsync(id);
            return Ok(new { Message = "Ürün başarıyla soft-delete edildi." });
        }

        // Genel Kullanıcı Soft Delete (Admin/SuperAdmin korumalı)
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> SoftDeleteUser(long id)
        {
            await adminService.SoftDeleteUserAsync(id);
            return Ok(new { Message = "Kullanıcı hesabı başarıyla soft-delete edildi." });
        }
    }
}