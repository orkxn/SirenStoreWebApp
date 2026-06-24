using SirenStore.Application.DTOs; // Birazdan oluşturacağınız DTO'lar için

namespace SirenStore.Application.Interfaces
{
    public interface ISellerService
    {
        Task<IEnumerable<SellerDto>> GetAllSellersAsync();
        Task<SellerDto> GetSellerByIdAsync(long id);
        Task CreateSellerAsync(CreateSellerDto dto);
        Task ToggleAccountStatusAsync(long sellerId);
    }
}
