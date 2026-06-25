namespace Entities.Enums
{
    public enum OrderStatus
    {
        Received = 1,    // Sipariş Alındı
        Preparing = 2,   // Hazırlanıyor
        Shipped = 3,     // Kargoda
        Delivered = 4,   // Teslim Edildi
        Cancelled = 5    // İptal Edildi
    }
}
