namespace SirenStore.Application.DTOs
{
    public class ProductListDto
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Stock { get; set; }

        public long CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        
        public long SellerId { get; set; }
        public string StoreName { get; set; } = string.Empty;

        public string? MainImageUrl { get; set; }
        public List<string> ImageUrls { get; set; } = new List<string>();
        public List<string> Tags { get; set; } = new List<string>();
    }
}