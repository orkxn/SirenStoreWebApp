namespace Entities.Models;

public class ProductReview : BaseModel
{
    public long ProductId { get; set; } 
    public Product Product { get; set; }

    public string UserEmail { get; set; } 
    public string Comment { get; set; }   
    public int Rating { get; set; }       
}