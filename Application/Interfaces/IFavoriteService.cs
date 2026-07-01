using SirenStore.Application.DTOs;

namespace SirenStore.Application.Interfaces
{
    public interface IFavoriteService
    {
        Task AddToFavoritesAsync(long userId, long productId);
        Task RemoveFromFavoritesAsync(long userId, long productId);
        Task<List<ProductListDto>> GetFavoritesAsync(long userId);
        Task<List<long>> GetFavoriteProductIdsAsync(long userId);
    }
}
