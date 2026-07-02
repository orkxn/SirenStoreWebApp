using Entities.Enums;

namespace Entities.Models
{
    public class VendorApplication : BaseModel
    {
        public string CompanyName { get; set; }
        public string ContactFullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string? TaxNumber { get; set; }
        public string? TaxOffice { get; set; }
        public string? CompanyAddress { get; set; }
        public string? WebsiteUrl { get; set; }
        public string? Description { get; set; }

        public ApplicationStatus Status { get; set; }
        public string? RejectionReason { get; set; }
        public DateTime? ReviewDate { get; set; }
        public long? ReviewedByUserId { get; set; }
    }
}
