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
        public bool IsActive { get; set; } = true; // varsayılan olarak aktif başlar
        public bool IsEmailConfirmed { get; set; } = false;

        // jwt token ve refresh token için alanlar
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }

        // müşteri adres için
        public ICollection<Address> Addresses { get; set; }

        // navigation property
        public Seller? Seller { get; set; }
        public ICollection<LoginHistory> LoginHistories { get; set; }
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}