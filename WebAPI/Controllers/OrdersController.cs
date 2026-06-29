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
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        // sipariş oluşturma
        // POST: api/orders
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            var userId = GetUserIdFromToken();
            var order = await _orderService.CreateOrderAsync(userId, dto);
            return Ok(order);
        }

        // müşterinin vermiş olduğu tüm siparişleri listeleme
        // GET: api/orders
        [HttpGet]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = GetUserIdFromToken();
            var orders = await _orderService.GetUserOrdersAsync(userId);
            return Ok(orders);
        }

        // satıcıya gelen tüm siparişleri listeleme
        // GET: api/orders/seller
        [HttpGet("seller")]
        [Authorize(Roles = "Seller")]
        public async Task<IActionResult> GetSellerOrders()
        {
            var userId = GetUserIdFromToken();
            var orders = await _orderService.GetSellerOrdersAsync(userId);
            return Ok(orders);
        }

        // belirli bir siparişin detaylarını getirme
        // GET: api/orders/{id}
        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetOrderById(long id)
        {
            var userId = GetUserIdFromToken();
            var order = await _orderService.GetOrderByIdAsync(userId, id);
            return Ok(order);
        }

        // sipariş kaleminin durumunu güncelleme
        // PUT: api/orders/items/{orderItemId}/status
        [HttpPut("items/{orderItemId:long}/status")]
        [Authorize(Roles = "Admin,Seller")]
        public async Task<IActionResult> UpdateItemStatus(long orderItemId, [FromBody] OrderStatus newStatus)
        {
            var userId = GetUserIdFromToken();

            await _orderService.UpdateOrderItemStatusAsync(userId, orderItemId, newStatus);

            return Ok(new { message = $"Sipariş kaleminin durumu başarıyla '{newStatus.ToString()}' olarak güncellendi." });
        }

        // jwt'den kullanıcı kimliğini alma
        private long GetUserIdFromToken()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                throw new UnauthorizedAccessException("Geçerli bir kullanıcı kimliği bulunamadı.");

            return long.Parse(userIdClaim.Value);
        }
    }
}