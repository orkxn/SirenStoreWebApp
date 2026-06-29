using Entities.Enums;

namespace Entities.Models
{
    public class Order : BaseModel
    {
        // siparişi veren müşteri
        public long UserId { get; set; }
        public User User { get; set; } = null!;

        // siparişin toplam tutarı veritabanında cache olarak tutulması sorgu performansını artırır
        public decimal TotalPrice { get; set; }

        // teslimat adresi bilgileri
        public string AddressTitle { get; set; } = string.Empty;
        public string ShippingAddress { get; set; } = string.Empty;

        // sipariş durumu (enum)
        public OrderStatus Status { get; set; } = OrderStatus.Received;

        // siparişe ait alt kalemler
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}