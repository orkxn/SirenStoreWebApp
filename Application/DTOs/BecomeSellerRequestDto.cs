namespace SirenStore.Application.DTOs {
    public record BecomeSellerRequestDto(
        string StoreName,
        string TaxNumber,
        string Address
    );
}