using SirenStore.Application.DTOs;
using Entities.Models;
using Entities.Enums;

namespace SirenStore.Application.Interfaces
{
    public interface IOrderService
    {
        // Müşterinin sepetindeki ürünleri resmi bir siparişe dönüştürür (Stok düşürür ve sepeti temizler)
        Task<OrderDto> CreateOrderAsync(long userId, CreateOrderDto dto);

        // Müşterinin kendi geçmiş sipariş listesini getirir
        Task<List<OrderDto>> GetUserOrdersAsync(long userId);

        // Belirli bir siparişin detayını getirir
        Task<OrderDto> GetOrderByIdAsync(long userId, long orderId);

        // Satıcının veya Adminin sipariş durumunu güncellemesini sağlar
        Task UpdateOrderItemStatusAsync(long userId, long orderItemId, OrderStatus newStatus);
    }
}