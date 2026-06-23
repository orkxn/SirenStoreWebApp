namespace SirenStore.Application.DTOs
{
   public record CreateAdminDto(string Username, string Email, string Password, string Role);
}