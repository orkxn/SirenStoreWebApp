using SirenStore.Application.DTOs;

namespace SirenStore.Application.Interfaces
{
    public interface ISellerService
    {
        // 1. Müşterinin satıcı olmak için başvurması
        Task BecomeSellerAsync(long userId, BecomeSellerRequestDto dto);

        // 2. Admin'in başvuruyu onaylaması (veya reddetmesi)
        Task ApproveSellerAsync(long sellerId);
        Task RejectSellerAsync(long sellerId);
        Task<SellerPublicProfileDto> GetSellerProfileAsync(long sellerId);
    }
}