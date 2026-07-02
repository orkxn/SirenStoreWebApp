namespace Entities.Models
{
    public class BasketItem : BaseModel
    {
        public long BasketId { get; set; }
        public Basket Basket { get; set; } = null!;

        public long? ProductId { get; set; }
        public Product? Product { get; set; }

        // sepete eklenen ürünün adedi
        public int Quantity { get; set; }
    }
}