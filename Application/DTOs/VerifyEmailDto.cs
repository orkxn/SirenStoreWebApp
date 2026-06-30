namespace SirenStore.Application.DTOs
{
    public record VerifyEmailDto(
        string Email,
        string Token
    );
}
