namespace Entities.Models
{
    public class SellerAddress : BaseModel
    {
        // Foreign Key
        public long SellerId { get; set; }

        public string AddressType { get; set; }
        public string City { get; set; }
        public string District { get; set; }
        public string FullAddress { get; set; }
        public string ZipCode { get; set; }

        // Navigation Property
        public Seller Seller { get; set; }
    }
}
