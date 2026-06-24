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
        public bool IsActive { get; set; } = true; // Varsayılan olarak aktif başlar
        public bool IsEmailConfirmed { get; set; } = false;

        // JWT Güvenliği: Oturumu sürekli açık tutmak için gereken alanlar
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }

        // Müşteri "Adres Yönetimi" gereksinimi için
        public ICollection<Address> Addresses { get; set; }

        // Navigation Properties
        public Seller? Seller { get; set; }
        public ICollection<LoginHistory> LoginHistories { get; set; }

        // Not: İleride Faz 2'ye geçtiğimizde buraya Basket, Orders ve Favorites de gelecek.
    }
}