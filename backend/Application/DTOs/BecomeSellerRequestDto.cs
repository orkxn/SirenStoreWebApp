namespace SirenStore.Application.DTOs
{
    public class BecomeSellerRequestDto
    {
        public string StoreName { get; set; } = string.Empty;
        public string TaxNumber { get; set; } = string.Empty;
        public string? TaxOffice { get; set; }
    }
}