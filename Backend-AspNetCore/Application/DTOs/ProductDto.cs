namespace SirenStore.Application.DTOs
{
    public record ProductDto(
        long Id,
        string Name,
        string Description,
        string Brand,
        decimal Price,
        int Stock,
        long SellerId,
        bool IsActive
    );
}