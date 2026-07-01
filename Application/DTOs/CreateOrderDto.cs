namespace SirenStore.Application.DTOs
{
    public class CreateOrderDto
    {
        public string AddressTitle { get; set; } = string.Empty;
        public string ShippingAddress { get; set; } = string.Empty;
        public string CardNumber { get; set; } = string.Empty;
        public string CardHolderName { get; set; } = string.Empty;
        public string CardExpiry { get; set; } = string.Empty;
        public string CardCvv { get; set; } = string.Empty;
    }
}