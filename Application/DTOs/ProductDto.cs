namespace SirenStore.Application.DTOs
{
    public record ProductDto(
        long Id,
        string Name,
        string Description,
        decimal Price,
        int Stock,
        long SellerId,
        bool IsActive
    );
}