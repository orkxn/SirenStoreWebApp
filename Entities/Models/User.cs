using Entities.Enums;

namespace Entities.Models
{
    public class User : BaseModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string? PhoneNumber { get; set; }

        public UserTypes UserType { get; set; }
        public bool IsActive { get; set; }
        public bool IsEmailConfirmed { get; set; }

        // Navigation Properties
        public Seller? Seller { get; set; }
        public ICollection<LoginHistory> LoginHistories { get; set; }
    }
}
