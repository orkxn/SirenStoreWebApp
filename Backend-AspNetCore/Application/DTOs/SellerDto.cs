namespace SirenStore.Application.DTOs
{
    public record SellerDto(
        long Id,
        string StoreName,
        string ContactEmail,
        string ContactPhone,
        bool IsApproved,
        bool IsActive
    );
}