using Microsoft.AspNetCore.Mvc;
using SirenStore.Application.DTOs;
using SirenStore.Application.Interfaces;

namespace SirenStore.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // İnternet adresi otomatik olarak: api/sellers olacak
    public class SellersController(ISellerService sellerService) : ControllerBase
    {
        // 1. GET: api/sellers (Tüm satıcıları listeler)
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var sellers = await sellerService.GetAllSellersAsync();
            return Ok(sellers); // HTTP 200
        }

        // 2. GET: api/sellers/5 (ID'ye göre tek bir satıcı getirir)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(long id)
        {
            var seller = await sellerService.GetSellerByIdAsync(id);
            // Not: Eğer satıcı bulunamadıysa Manager katmanında yazdığın NotFoundException tetiklenecek
            return Ok(seller);
        }

        // 3. POST: api/sellers (Yeni satıcı ekler)
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSellerDto dto)
        {
            await sellerService.CreateSellerAsync(dto);
            return StatusCode(201, new { Message = "Satıcı başarıyla eklendi." }); // HTTP 201 Created
        }

        [HttpPatch("{id}/toggle-status")]
        public async Task<IActionResult> ToggleAccountStatus(long id)
        {
            await sellerService.ToggleAccountStatusAsync(id);
            return Ok(new { Message = "Mağaza aktiflik durumu başarıyla değiştirildi." });
        }
    }
}