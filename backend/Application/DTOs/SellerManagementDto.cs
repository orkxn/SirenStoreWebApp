using Entities.Enums;

namespace SirenStore.Application.DTOs
{
    public class SellerManagementDto
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public string UserEmail { get; set; } = string.Empty;
        public string StoreName { get; set; } = string.Empty;
        public string? TaxNumber { get; set; }
        public string? TaxOffice { get; set; }
        public string ContactEmail { get; set; } = string.Empty;
        public string ContactPhone { get; set; } = string.Empty;
        public string SupportLine { get; set; } = string.Empty;
        public SellerStatus Status { get; set; } // Onaylı mı, Beklemede mi, Reddedildi mi?
        public bool IsDeleted { get; set; } // Satıcı dükkanı banlanmış mı?
    }
}