namespace SirenStore.Application.DTOs
{
    public record CreateProductDto(
        string Name,
        string Brand,
        string Description,
        decimal Price,
        int Stock,
        long SellerId,
        long CategoryId
    );
}