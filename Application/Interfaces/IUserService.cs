using SirenStore.Application.DTOs;

namespace SirenStore.Application.Interfaces
{
    public interface IUserService
    {
        // 1. Giriş yapmış kullanıcının profil bilgilerini getiren metot
        Task<UserProfileDto> GetProfileAsync(long userId);

        // 2. Kullanıcının ad, soyad, telefon gibi bilgilerini güncelleyen metot
        Task UpdateProfileAsync(long userId, UpdateProfileDto dto);

        // 3. Kullanıcının şifresini güvenli bir şekilde değiştiren metot
        Task ChangePasswordAsync(long userId, ChangePasswordDto dto);
    }
}