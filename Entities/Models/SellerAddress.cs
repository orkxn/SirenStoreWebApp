namespace Entities.Models
{
    public class SellerAddress : BaseModel
    {
        // foreign key 
        public long SellerId { get; set; }

        public string AddressType { get; set; }
        public string City { get; set; }
        public string District { get; set; }
        public string FullAddress { get; set; }
        public string ZipCode { get; set; }

        // navigation property
        public Seller Seller { get; set; }
    }
}
