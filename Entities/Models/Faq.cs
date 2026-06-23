namespace Entities.Models
{
    public class Faq : BaseModel
    {
        public string Question { get; set; }
        public string Answer { get; set; }
        public string? Category { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
    }
}
