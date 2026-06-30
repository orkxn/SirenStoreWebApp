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
        public bool IsActive { get; set; } = true;
        public bool IsEmailConfirmed { get; set; } = false;
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
        public string? EmailVerificationToken { get; set; }
        public DateTime? EmailVerificationTokenExpiry { get; set; }
        public ICollection<Address> Addresses { get; set; }
        public Seller? Seller { get; set; }
        public ICollection<LoginHistory> LoginHistories { get; set; }
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}