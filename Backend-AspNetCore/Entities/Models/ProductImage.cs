namespace Entities.Models
{
    public class ProductImage : BaseModel
    {
        // fotonun urlsi
        public string ImageUrl { get; set; } = string.Empty;

        // ana foto mu değil mi belirtir
        public bool IsMain { get; set; } = false;

        // fotonun ait olduğu ürün
        public long? ProductId { get; set; }
        public virtual Product? Product { get; set; }
    }
}