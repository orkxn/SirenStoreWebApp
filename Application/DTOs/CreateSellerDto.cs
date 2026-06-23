namespace SirenStore.Application.DTOs
{
    public record CreateSellerDto(
        string StoreName,
        string ContactEmail,
        string ContactPhone,
        string SupportLine
    );
}