using Entities.Enums;

namespace Entities.Models
{
    public class Order : BaseModel
    {
        // Siparişi veren müşteri
        public long UserId { get; set; }
        public User User { get; set; } = null!;

        // Siparişin toplam tutarı Veritabanında cache olarak tutulması sorgu performansını artırır
        public decimal TotalPrice { get; set; }

        // Teslimat adresi bilgileri Şimdilik basit tutuyoruz
        public string AddressTitle { get; set; } = string.Empty;
        public string ShippingAddress { get; set; } = string.Empty;

        // Sipariş Durumu Örn: Alındı, Hazırlanıyor, Kargoda, Teslim Edildi
        public OrderStatus Status { get; set; } = OrderStatus.Received;

        // Siparişe ait alt kalemler
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}