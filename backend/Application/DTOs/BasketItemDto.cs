namespace SirenStore.Application.DTOs
{
    public class BasketItemDto
    {
        public long Id { get; set; } // BasketItem'ın kendi benzersiz ID'si (Silme işlemi için lazım)
        public long ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public decimal Price { get; set; } // Ürünün güncel birim fiyatı
        public int Quantity { get; set; } // Kaç adet eklendiği
        public decimal TotalPrice => Price * Quantity;
        public string? ProductImageUrl { get; set; } // Ürünün vitrin fotoğrafı
    }
}