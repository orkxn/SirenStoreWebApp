using SirenStore.Application.DTOs;

namespace SirenStore.Application.Services
{
    public interface IAdminService
    {
        Task<AdminDto?> GetAdminByIdAsync(long id);
        Task CreateAdminWithPasswordAsync(CreateAdminDto dto); // Şifreleme mantığı içerecek
    }
}