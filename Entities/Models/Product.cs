namespace Entities.Models
{
    public class Product : BaseModel 
    {
        public string Name { get; set; } 
        public string Brand { get; set; } 
        public string Description { get; set; } 
        public bool IsActive { get; set; } 

        public decimal Price { get; set; } 
        public int Stock { get; set; }
        
        public long CategoryId { get; set; } 
        public Category Category { get; set; }
        
        public int SellerId { get; set; } 
        public Seller Seller { get; set; }

       
        public List<ProductImage> Images { get; set; }
        public List<ProductReview> Reviews { get; set; } 
        public List<ProductQuestion> Questions { get; set; } 
    }
}