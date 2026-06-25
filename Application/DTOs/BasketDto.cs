namespace SirenStore.Application.DTOs
{
    public class BasketDto
    {
        public long Id { get; set; }
        public List<BasketItemDto> Items { get; set; } = new List<BasketItemDto>();
        public decimal GrandTotal => Items.Sum(item => item.TotalPrice);
    }
}