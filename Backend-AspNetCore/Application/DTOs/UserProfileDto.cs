using Entities.Enums;

namespace SirenStore.Application.DTOs
{
    public class UserProfileDto
    {
        public long Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public UserTypes UserType { get; set; }
        public bool IsEmailConfirmed { get; set; }
    }
}