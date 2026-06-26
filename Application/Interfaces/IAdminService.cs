using SirenStore.Application.DTOs;

namespace SirenStore.Application.Interfaces
{
    public interface IAdminService
    {
        Task<List<UserManagementDto>> GetAllUsersAsync();
        Task<List<SellerManagementDto>> GetAllSellersAsync();
        Task BanUserAsync(long currentUserId, long targetUserId);
        Task UnbanUserAsync(long userId);
    }
}