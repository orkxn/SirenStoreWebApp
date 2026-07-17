namespace Entities.Models
{
    public class Basket : BaseModel
    {
        // sepetin hangi customer'a ait olduğu
        public long UserId { get; set; }
        public User User { get; set; } = null!;

        // sepetteki ürün kalemleri
        public ICollection<BasketItem> BasketItems { get; set; } = new List<BasketItem>();
    }
}