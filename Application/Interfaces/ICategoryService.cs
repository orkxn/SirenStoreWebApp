using SirenStore.Application.DTOs;

namespace SirenStore.Application.Interfaces
{
    public interface ICategoryService
    {
        Task<List<CategoryDto>> GetAllCategoriesAsync();
        Task<CategoryDto> GetCategoryByIdAsync(long id);
        Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto dto);
        Task<CategoryDto> UpdateCategoryAsync(long id, UpdateCategoryDto dto);
        Task DeleteCategoryAsync(long id);
    }
}