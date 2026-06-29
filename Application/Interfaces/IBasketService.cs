using SirenStore.Application.DTOs;

namespace SirenStore.Application.Interfaces
{
    public interface IBasketService
    {
        // kullanıcının aktif sepetini detaylarıyla ürün adı, fiyatı, resmi vb. getirir
        Task<BasketDto> GetBasketAsync(long userId);

        // sepete yeni ürün ekler VEYA ürün zaten varsa adedini artırır
        Task AddToBasketAsync(long userId, AddToBasketDto dto);

        // sepetteki bir ürünün adedini doğrudan günceller Örn: Postman'den adet = 5 göndermek
        Task UpdateBasketItemQuantityAsync(long userId, AddToBasketDto dto);

        // sepetten belirli bir ürünü tamamen kaldırır
        Task RemoveFromBasketAsync(long userId, long productId);

        // sipariş tamamlandığında sepetin içini tamamen boşaltır
        Task ClearBasketAsync(long userId);
    }
}