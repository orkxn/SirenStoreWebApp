namespace Entities.Models
{
    public class SellerFinance : BaseModel
    {
        // foreign key
        public long SellerId { get; set; }

        public string CompanyType { get; set; }
        public string TaxOffice { get; set; }
        public string TaxNumber { get; set; }

        public string IbanNumber { get; set; }
        public string BankName { get; set; }

        // navigation property
        public Seller Seller { get; set; }
    }
}
