using Entities.Enums;
using Entities.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SirenStore.Application.DTOs;
using SirenStore.Application.Services;
using SirenStore.WebAPI.Extensions;
using System.Security.Claims;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly OrderService _orderService;

        public OrdersController(OrderService orderService)
        {
            _orderService = orderService;
        }

        // sipariş oluşturma
        // POST: api/orders
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            var userId = User.GetUserId();
            var order = await _orderService.CreateOrderAsync(userId, dto);
            return Ok(order);
        }

        // müşterinin vermiş olduğu tüm siparişleri listeleme
        // GET: api/orders
        [HttpGet]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = User.GetUserId();
            var orders = await _orderService.GetUserOrdersAsync(userId);
            return Ok(orders);
        }

        // satıcıya gelen tüm siparişleri listeleme
        // GET: api/orders/seller
        [HttpGet("seller")]
        [Authorize(Roles = "Seller")]
        public async Task<IActionResult> GetSellerOrders()
        {
            var userId = User.GetUserId();
            var orders = await _orderService.GetSellerOrdersAsync(userId);
            return Ok(orders);
        }

        // belirli bir siparişin detaylarını getirme
        // GET: api/orders/{id}
        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetOrderById(long id)
        {
            var userId = User.GetUserId();
            var order = await _orderService.GetOrderByIdAsync(userId, id);
            return Ok(order);
        }

        // sipariş kaleminin durumunu güncelleme
        // PUT: api/orders/items/{orderItemId}/status
        [HttpPut("items/{orderItemId:long}/status")]
        [Authorize(Roles = "Admin,Seller")]
        public async Task<IActionResult> UpdateItemStatus(long orderItemId, [FromBody] OrderStatus newStatus)
        {
            var userId = User.GetUserId();

            await _orderService.UpdateOrderItemStatusAsync(userId, orderItemId, newStatus);

            return Ok(new { message = $"Sipariş kaleminin durumu başarıyla '{newStatus.ToString()}' olarak güncellendi." });
        }

        // kullanıcının daha önceki siparişlerinde kullandığı adresleri listeleme
        // GET: api/orders/saved-addresses
        [HttpGet("saved-addresses")]
        public async Task<IActionResult> GetSavedAddresses()
        {
            var userId = User.GetUserId();
            var addresses = await _orderService.GetSavedAddressesAsync(userId);
            return Ok(addresses);
        }

        // kullanıcının daha önceki siparişlerinde kullandığı bir adresi (başlığını temizleyerek) silme
        // DELETE: api/orders/saved-addresses
        [HttpDelete("saved-addresses")]
        public async Task<IActionResult> DeleteSavedAddress([FromQuery] string addressTitle)
        {
            var userId = User.GetUserId();
            await _orderService.DeleteSavedAddressAsync(userId, addressTitle);
            return Ok(new { message = "Kayıtlı adres başarıyla silindi." });
        }
    }
}