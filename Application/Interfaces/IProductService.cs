using SirenStore.Application.DTOs;

namespace SirenStore.Application.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<ProductListDto>> GetAllAsync(); 
        Task<IEnumerable<ProductListDto>> GetByCategoryIdAsync(long categoryId);
        Task<ProductListDto> GetByIdAsync(long id); // Ürün detayını getirir

        // Satıcının Kendi Ürünlerini Listelemesi
        Task<IEnumerable<ProductListDto>> GetMyProductsAsync(long userId); // Ürün detayını getirir

        // Satıcıya Özel Yönetim İşlemleri (Sadece Mağaza Sahibi)
        Task CreateAsync(long userId, CreateProductDto dto); // Ürün oluşturma işlemi
        Task UpdateAsync(long userId, UpdateProductDto dto); // Ürün güncelleme işlemi
        Task DeleteAsync(long userId, long productId); // Ürün silme işlemi
    }
}