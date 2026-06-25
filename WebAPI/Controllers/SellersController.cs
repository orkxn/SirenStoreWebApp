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

        // Herkes Bir Mağazanın Profilini ve Ürünlerini Görebilir
        // GET: api/sellers/{id}/profile
        [HttpGet("{id:long}/profile")]
        public async Task<IActionResult> GetSellerProfile(long id)
        {
            var profile = await _sellerService.GetSellerProfileAsync(id);
            return Ok(profile);
        }

        // 1. SATICI BAŞVURUSU YAPMA
        // Sadece giriş yapmış müşteriler veya genel kullanıcılar başvurabilir.
        [Authorize]
        [HttpPost("apply")]
        public async Task<IActionResult> BecomeSeller([FromBody] BecomeSellerRequestDto dto)
        {
            // Token içerisinden güvenli bir şekilde userId sökülüyor (IDOR Koruması)
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
                return Unauthorized("Geçersiz kullanıcı oturumu.");

            await _sellerService.BecomeSellerAsync(userId, dto);

            return Ok(new { message = "Satıcı başvurunuz başarıyla alındı. Admin onayı bekleniyor." });
        }

        // 2. ADMIN: BAŞVURUYU ONAYLAMA
        // Sadece Admin rolüne sahip kullanıcılar tetikleyebilir.
        [Authorize(Roles = "Admin")]
        [HttpPost("approve/{sellerId}")]
        public async Task<IActionResult> ApproveSeller(long sellerId)
        {
            await _sellerService.ApproveSellerAsync(sellerId);
            return Ok(new { message = "Satıcı başvurusu başarıyla onaylandı. Kullanıcı rolü 'Seller' olarak güncellendi." });
        }

        // 3. ADMIN: BAŞVURUYU REDDETME
        // Sadece Admin rolüne sahip kullanıcılar tetikleyebilir.
        [Authorize(Roles = "Admin")]
        [HttpPost("reject/{sellerId}")]
        public async Task<IActionResult> RejectSeller(long sellerId)
        {
            await _sellerService.RejectSellerAsync(sellerId);
            return Ok(new { message = "Satıcı başvurusu reddedildi." });
        }
    }
}