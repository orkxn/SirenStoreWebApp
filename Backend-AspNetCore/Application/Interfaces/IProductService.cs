using SirenStore.Application.DTOs;

namespace SirenStore.Application.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<ProductListDto>> GetAllAsync(); 
        Task<IEnumerable<ProductListDto>> GetByCategoryIdAsync(long categoryId);
        Task<ProductListDto> GetByIdAsync(long id); 
        Task<IEnumerable<ProductListDto>> GetMyProductsAsync(long userId); 
        Task CreateAsync(long userId, CreateProductDto dto); 
        Task UpdateAsync(long userId, UpdateProductDto dto); 
        Task DeleteAsync(long userId, long productId); 
    }
}