using SirenStore.Application.DTOs; // Birazdan oluşturacağınız DTO'lar için

namespace SirenStore.Application.Services
{
    public interface ISellerService
    {
        Task<IEnumerable<SellerDto>> GetAllSellersAsync();
        Task<SellerDto?> GetSellerByIdAsync(long id);
        Task CreateSellerAsync(CreateSellerDto dto);
        Task ApproveSellerAsync(long sellerId); // Satıcıyı onaylama iş mantığı
    }
}