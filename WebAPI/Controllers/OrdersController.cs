using Entities.Enums;
using Entities.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SirenStore.Application.DTOs;
using SirenStore.Application.Interfaces;
using System.Security.Claims;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Sipariş süreçleri giriş yapmış kullanıcı gerektirir
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        // 1. Sipariş Oluşturma (Checkout)
        // POST: api/orders
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            var userId = GetUserIdFromToken();
            var order = await _orderService.CreateOrderAsync(userId, dto);
            return Ok(order); // Oluşan siparişin detaylarını (OrderDto) döner
        }

        // 2. Müşterinin Kendi Geçmiş Siparişlerini Listeleme
        // GET: api/orders
        [HttpGet]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = GetUserIdFromToken();
            var orders = await _orderService.GetUserOrdersAsync(userId);
            return Ok(orders);
        }

        // SATICIYA ÖZEL: Satıcının Kendi Ürünlerine Gelen Siparişleri Listeleme
        // GET: api/orders/seller
        [HttpGet("seller")]
        [Authorize(Roles = "Seller")]
        public async Task<IActionResult> GetSellerOrders()
        {
            var userId = GetUserIdFromToken();
            var orders = await _orderService.GetSellerOrdersAsync(userId);
            return Ok(orders);
        }

        // 3. Belirli Bir Siparişin Detayını Getirme
        // GET: api/orders/{id}
        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetOrderById(long id)
        {
            var userId = GetUserIdFromToken();
            var order = await _orderService.GetOrderByIdAsync(userId, id);
            return Ok(order);
        }

        // SATICI VEYA ADMIN: Sipariş Kaleminin Durumunu Güncelleme IDOR Korumalı
        // PUT: api/orders/items/{orderItemId}/status
        [HttpPut("items/{orderItemId:long}/status")]
        [Authorize(Roles = "Admin,Seller")]
        public async Task<IActionResult> UpdateItemStatus(long orderItemId, [FromBody] OrderStatus newStatus)
        {
            // Temiz ve Güvenli: ID'yi aşağıdaki yardımcı metottan çekiyoruz
            var userId = GetUserIdFromToken();

            // İş mantığı katmanına güvenli parametreleri paslıyoruz
            await _orderService.UpdateOrderItemStatusAsync(userId, orderItemId, newStatus);

            return Ok(new { message = $"Sipariş kaleminin durumu başarıyla '{newStatus.ToString()}' olarak güncellendi." });
        }

        // JWT Token'dan UserId Çeken Yardımcı Metot
        private long GetUserIdFromToken()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                throw new UnauthorizedAccessException("Geçerli bir kullanıcı kimliği bulunamadı.");

            return long.Parse(userIdClaim.Value);
        }
    }
}