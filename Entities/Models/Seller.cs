using System.Collections.Generic;

namespace Entities.Models
{
    public class Seller : BaseModel
    {
        public string StoreName { get; set; }
        public string ContactEmail { get; set; }
        public string ContactPhone { get; set; }
        public string SupportLine { get; set; }

        public bool IsApproved { get; set; }
        public bool IsActive { get; set; }

        // Navigation Properties
        public SellerFinance FinanceInfo { get; set; }
        public ICollection<SellerAddress> Addresses { get; set; }
    }
}
