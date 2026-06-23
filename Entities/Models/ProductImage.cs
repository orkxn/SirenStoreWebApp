namespace Entities.Models;

public class ProductImage : BaseModel
{
    public long ProductId { get; set; } 
    public Product Product { get; set; }

    public string Url { get; set; } 
    public bool IsMain { get; set; } 
}