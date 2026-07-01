namespace Entities.Models
{
    public class Favorite : BaseModel
    {
        public long UserId { get; set; }
        public User User { get; set; } = null!;

        public long ProductId { get; set; }
        public Product Product { get; set; } = null!;
    }
}
