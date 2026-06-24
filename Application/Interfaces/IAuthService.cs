using SirenStore.Application.DTOs;

namespace SirenStore.Application.Interfaces
{
    public interface IAuthService
    {
        Task RegisterAsync(RegisterDto dto);
        Task<TokenDto> LoginAsync(LoginDto dto);
        Task<TokenDto> RefreshTokenAsync(string refreshToken);
    }
}