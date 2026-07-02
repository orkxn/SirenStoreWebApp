using SirenStore.Application.DTOs;

namespace SirenStore.Application.Interfaces
{
    public interface ISellerService
    {
        Task BecomeSellerAsync(long userId, CreateSellerDto dto);
        Task ApproveSellerAsync(long sellerId);
        Task RejectSellerAsync(long sellerId);
        Task<SellerPublicProfileDto> GetSellerProfileAsync(long sellerId);
        Task<Entities.Models.Seller?> GetSellerByUserIdAsync(long userId);
    }
}