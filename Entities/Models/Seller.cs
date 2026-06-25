using Entities.Enums;

namespace Entities.Models
{
    public class Seller : BaseModel
    {
        // Mağaza Bilgileri
        public string StoreName { get; set; } = string.Empty;
        public string TaxNumber { get; set; } = string.Empty; 
        public string? TaxOffice { get; set; } 

        // Başvuru Durumu (Varsayılan olarak Beklemede başlar)
        public SellerStatus Status { get; set; } = SellerStatus.Pending;

        // Kullanıcı İlişkisi (1-to-1 Relationship)
        // Her satıcının mutlaka bir User kaydı olmak zorunda.
        public long UserId { get; set; }
        public virtual User User { get; set; } = null!;

        // İleride Faz-4'te kullanacağımız ürünler ilişkisi (1-to-Many)
        // Bir satıcının birden fazla ürünü olabilir.
        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    }
}