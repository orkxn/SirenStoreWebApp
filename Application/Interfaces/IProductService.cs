using SirenStore.Application.DTOs;

namespace SirenStore.Application.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDto>> GetAllProductsAsync();
        Task<ProductDto?> GetProductByIdAsync(long id);
        Task CreateProductAsync(CreateProductDto dto);
        Task UpdateStockAsync(long productId, int quantity); // Ürüne has iş mantığı
    }
}
