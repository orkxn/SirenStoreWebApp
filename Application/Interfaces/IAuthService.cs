using SirenStore.Application.DTOs;

namespace SirenStore.Application.Interfaces
{
    public interface IAuthService
    {
        Task RegisterAsync(RegisterDto dto);
        Task<TokenDto> LoginAsync(LoginDto dto, string ipAddress, string? userAgent);
        Task<TokenDto> RefreshTokenAsync(string refreshToken);
        Task<TokenDto> VerifyEmailAsync(VerifyEmailDto dto);
        Task ResendVerificationEmailAsync(ResendVerificationEmailDto dto);
    }
}