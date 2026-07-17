namespace Entities.Models
{
    public class Category : BaseModel
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;


        // bir kategorinin birden fazla ürünü olabilir bire çok
        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    }
}