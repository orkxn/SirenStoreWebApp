using SirenStore.Application.DTOs;
using Entities.Models;
using Entities.Enums;

namespace SirenStore.Application.Interfaces
{
    public interface IOrderService
    {
        // müşterinin sepetindeki ürünleri siparişe dönüştürür
        Task<OrderDto> CreateOrderAsync(long userId, CreateOrderDto dto);

        // müşterinin kendi geçmiş sipariş listesini getirir
        Task<List<OrderDto>> GetUserOrdersAsync(long userId);

        // satıcının, kendi ürünlerine gelen siparişleri listeleyebilmesi için
        Task<List<OrderDto>> GetSellerOrdersAsync(long userId);

        // belirli bir siparişin detayını getirir
        Task<OrderDto> GetOrderByIdAsync(long userId, long orderId);

        // satıcının veya adminin sipariş durumunu güncellemesini sağlar
        Task UpdateOrderItemStatusAsync(long userId, long orderItemId, OrderStatus newStatus);
    }
}