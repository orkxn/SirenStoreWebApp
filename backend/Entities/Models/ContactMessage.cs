namespace Entities.Models
{
    public class ContactMessage : BaseModel
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }
        public bool IsRead { get; set; }
        public bool IsReplied { get; set; }
        public string? ReplyMessage { get; set; }
        public DateTime? ReplyDate { get; set; }
    }
}
