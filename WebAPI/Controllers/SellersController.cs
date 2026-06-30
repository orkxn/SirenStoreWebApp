using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SirenStore.Application.DTOs;
using SirenStore.Application.Interfaces;
using System.Security.Claims;

namespace SirenStore.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SellersController : ControllerBase
    {
        private readonly ISellerService _sellerService;

        public SellersController(ISellerService sellerService)
        {
            _sellerService = sellerService;
        }

        // bir satıcının profilini almak için endpoint
        // GET: api/sellers/{id}/profile
        [HttpGet("{id:long}/profile")]
        public async Task<IActionResult> GetSellerProfile(long id)
        {
            var profile = await _sellerService.GetSellerProfileAsync(id);
            return Ok(profile);
        }

        // satıcı başvurusu yapmak için endpoint
        // POST: api/sellers/apply
        [Authorize]
        [HttpPost("apply")]
        public async Task<IActionResult> BecomeSeller([FromBody] CreateSellerDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
                return Unauthorized("Geçersiz kullanıcı oturumu.");

            await _sellerService.BecomeSellerAsync(userId, dto);

            return Ok(new { message = "Satıcı başvurunuz başarıyla alındı. Admin onayı bekleniyor." });
        }

        // satıcı başvurusunun durumunu almak için endpoint
        // GET: api/sellers/my-status
        [Authorize]
        [HttpGet("my-status")]
        public async Task<IActionResult> GetMySellerStatus()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
                return Unauthorized("Geçersiz kullanıcı oturumu.");

            var seller = await _sellerService.GetSellerByUserIdAsync(userId);
            if (seller == null)
                return Ok(new { hasApplied = false, status = "" });

            return Ok(new { 
                id = seller.Id,
                hasApplied = true, 
                status = seller.Status.ToString(),
                storeName = seller.StoreName,
                contactEmail = seller.ContactEmail,
                contactPhone = seller.ContactPhone,
                supportLine = seller.SupportLine,
                taxNumber = seller.TaxNumber,
                taxOffice = seller.TaxOffice
            });
        }

        // satıcı başvurusunu onaylamak için endpoint
        // POST: api/sellers/approve/{sellerId}
        [Authorize(Roles = "Admin")]
        [HttpPost("approve/{sellerId}")]
        public async Task<IActionResult> ApproveSeller(long sellerId)
        {
            await _sellerService.ApproveSellerAsync(sellerId);
            return Ok(new { message = "Satıcı başvurusu başarıyla onaylandı. Kullanıcı rolü 'Seller' olarak güncellendi." });
        }

        // satıcı başvurusunu reddetmek için endpoint
        // POST: api/sellers/reject/{sellerId}
        [Authorize(Roles = "Admin")]
        [HttpPost("reject/{sellerId}")]
        public async Task<IActionResult> RejectSeller(long sellerId)
        {
            await _sellerService.RejectSellerAsync(sellerId);
            return Ok(new { message = "Satıcı başvurusu reddedildi." });
        }
    }
}