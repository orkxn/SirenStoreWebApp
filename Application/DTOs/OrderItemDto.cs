namespace SirenStore.Application.DTOs
{
    public class OrderItemDto
    {
        public long ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal TotalPrice => Price * Quantity;
        public string Status { get; set; } = string.Empty;
    }
}