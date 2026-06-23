namespace Entities.Models;

public class ProductQuestion : BaseModel
{
    public long ProductId { get; set; } 
    public Product Product { get; set; }

    public string UserEmail { get; set; }    
    public string QuestionText { get; set; } 
    
    public string AnswerText { get; set; }   
    public DateTime? AnswerDate { get; set; } 
}