namespace Entities.Models
{
    public class Tag : BaseModel
    {
        public string Name { get; set; } = string.Empty;

        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
