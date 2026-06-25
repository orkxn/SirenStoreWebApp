using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SirenStore.Application.DTOs;
using SirenStore.Application.Interfaces;
using System.Security.Claims;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] 
    public class BasketsController : ControllerBase
    {
        private readonly IBasketService _basketService;

        public BasketsController(IBasketService basketService)
        {
            _basketService = basketService;
        }

        // 1. Müşterinin Kendi Sepetini Getirir
        // GET: api/baskets
        [HttpGet]
        public async Task<IActionResult> GetBasket()
        {
            var userId = GetUserIdFromToken();
            var basket = await _basketService.GetBasketAsync(userId);
            return Ok(basket);
        }

        // 2. Sepete Ürün Ekler (Ürün varsa adedini artırır)
        // POST: api/baskets/items
        [HttpPost("items")]
        public async Task<IActionResult> AddToBasket([FromBody] AddToBasketDto dto)
        {
            var userId = GetUserIdFromToken();
            await _basketService.AddToBasketAsync(userId, dto);
            return Ok(new { message = "Ürün başarıyla sepetinize eklendi." });
        }

        // 3. Sepetteki Bir Ürünün Adedini Doğrudan Günceller
        // PUT: api/baskets/items
        [HttpPut("items")]
        public async Task<IActionResult> UpdateItemQuantity([FromBody] AddToBasketDto dto)
        {
            var userId = GetUserIdFromToken();
            await _basketService.UpdateBasketItemQuantityAsync(userId, dto);
            return Ok(new { message = "Sepetinizdeki ürün adedi güncellendi." });
        }

        // 4. Sepetten Belirli Bir Ürünü Tamamen Kaldırır
        // DELETE: api/baskets/items/{productId}
        [HttpDelete("items/{productId:long}")]
        public async Task<IActionResult> RemoveFromBasket(long productId)
        {
            var userId = GetUserIdFromToken();
            await _basketService.RemoveFromBasketAsync(userId, productId);
            return Ok(new { message = "Ürün sepetinizden kaldırıldı." });
        }

        // 5. Sepeti Tamamen Boşaltır
        // DELETE: api/baskets/clear
        [HttpDelete("clear")]
        public async Task<IActionResult> ClearBasket()
        {
            var userId = GetUserIdFromToken();
            await _basketService.ClearBasketAsync(userId);
            return Ok(new { message = "Sepetiniz tamamen boşaltıldı." });
        }

        // JWT Token'dan NameIdentifier (UserId) Çeken Yardımcı Metot
        private long GetUserIdFromToken()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                throw new UnauthorizedAccessException("Geçerli bir kullanıcı kimliği bulunamadı.");

            return long.Parse(userIdClaim.Value);
        }
    }
}