using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SirenStore.Application.DTOs;
using SirenStore.Application.Interfaces;
using SirenStore.WebAPI.Extensions;
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

        // müşterinin sepetini getirir
        // GET: api/baskets
        [HttpGet]
        public async Task<IActionResult> GetBasket()
        {
            var userId = User.GetUserId();
            var basket = await _basketService.GetBasketAsync(userId);
            return Ok(basket);
        }

        // sepete ürün ekler
        // POST: api/baskets/items
        [HttpPost("items")]
        public async Task<IActionResult> AddToBasket([FromBody] AddToBasketDto dto)
        {
            var userId = User.GetUserId();
            await _basketService.AddToBasketAsync(userId, dto);
            return Ok(new { message = "Ürün başarıyla sepetinize eklendi." });
        }

        // sepetteki ürünün adedini günceller
        // PUT: api/baskets/items
        [HttpPut("items")]
        public async Task<IActionResult> UpdateItemQuantity([FromBody] AddToBasketDto dto)
        {
            var userId = User.GetUserId();
            await _basketService.UpdateBasketItemQuantityAsync(userId, dto);
            return Ok(new { message = "Sepetinizdeki ürün adedi güncellendi." });
        }

        // ürünü sepetten kaldırır
        // DELETE: api/baskets/items/{productId}
        [HttpDelete("items/{productId:long}")]
        public async Task<IActionResult> RemoveFromBasket(long productId)
        {
            var userId = User.GetUserId();
            await _basketService.RemoveFromBasketAsync(userId, productId);
            return Ok(new { message = "Ürün sepetinizden kaldırıldı." });
        }

        // sepetteki tüm ürünleri temizler
        // DELETE: api/baskets/clear
        [HttpDelete("clear")]
        public async Task<IActionResult> ClearBasket()
        {
            var userId = User.GetUserId();
            await _basketService.ClearBasketAsync(userId);
            return Ok(new { message = "Sepetiniz tamamen boşaltıldı." });
        }
    }
}