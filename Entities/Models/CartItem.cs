namespace Entities.Models
{
    public class CartItem : BaseModel
    {
        public long CartId { get; set; }
        public Cart Cart { get; set; }

        public long ProductId { get; set; }
        public Product Product { get; set; }

        public int Quantity { get; set; }
    }
}
