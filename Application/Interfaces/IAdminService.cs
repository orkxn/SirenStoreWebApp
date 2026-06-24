using SirenStore.Application.DTOs;

namespace SirenStore.Application.Interfaces
{
    public interface IAdminService
    {
        Task ApproveSellerAsync(long sellerId);
        Task SoftDeleteSellerAsync(long sellerId);

        Task SoftDeleteProductAsync(long productId);

        Task SoftDeleteUserAsync(long userId);
    }
}