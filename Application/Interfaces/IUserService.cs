using SirenStore.Application.DTOs;

namespace SirenStore.Application.Interfaces
{
    public interface IUserService
    {
        // giriş yapan kullanıcının profil bilgilerini döndüren metot
        Task<UserProfileDto> GetProfileAsync(long userId);

        // kullanıcının ad, soyad, telefon gibi bilgilerini güncelleyen metot
        Task UpdateProfileAsync(long userId, UpdateProfileDto dto);

        // kullanıcının şifresini güvenli bir şekilde değiştiren metot
        Task ChangePasswordAsync(long userId, ChangePasswordDto dto);
    }
}