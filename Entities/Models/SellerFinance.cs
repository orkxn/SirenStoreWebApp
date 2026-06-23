namespace Entities.Models
{
    public class SellerFinance : BaseModel
    {
        // Foreign Key
        public long SellerId { get; set; }

        public string CompanyType { get; set; }
        public string TaxOffice { get; set; }
        public string TaxNumber { get; set; }

        public string IbanNumber { get; set; }
        public string BankName { get; set; }

        // Navigation Property
        public Seller Seller { get; set; }
    }
}
