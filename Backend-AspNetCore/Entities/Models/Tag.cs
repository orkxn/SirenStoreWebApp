namespace Entities.Models
{
    public class Tag : BaseModel
    {
        public string Name { get; set; } = string.Empty;

        public long ProductId { get; set; }
        public virtual Product Product { get; set; } = null!;
    }
}
