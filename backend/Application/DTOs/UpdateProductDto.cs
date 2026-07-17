namespace SirenStore.Application.DTOs
{
    public class UpdateProductDto
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public long CategoryId { get; set; }
        public List<string> ImageUrls { get; set; } = new List<string>();
        public List<string> Tags { get; set; } = new List<string>();
    }
}