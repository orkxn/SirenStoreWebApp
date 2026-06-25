namespace Entities.Models
{
    public class Category : BaseModel
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;


        // Bir kategorinin birden fazla ürünü olabilir 1-to-Many
        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    }
}