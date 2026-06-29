using Entities.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models
{
    public class Seller : BaseModel
    {
        // mağaza bilgileri
        public string StoreName { get; set; } = string.Empty;
        public string? TaxNumber { get; set; }
        public string? TaxOffice { get; set; }

        public string ContactEmail { get; set; } = string.Empty;
        public string ContactPhone { get; set; } = string.Empty;
        public string SupportLine { get; set; } = string.Empty;

        // başvuru durumu
        public SellerStatus Status { get; set; } = SellerStatus.Pending;

        // kullanıcı ilişkisi bire çok 
        public long UserId { get; set; }
        public virtual User User { get; set; } = null!;
        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    }
}