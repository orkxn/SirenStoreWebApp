namespace Entities.Models
{
    public class LoginHistory : BaseModel
    {
        public long UserId { get; set; }
        public User User { get; set; }

        public string IpAddress { get; set; }
        public string? UserAgent { get; set; }
        public bool IsSuccessful { get; set; }
        public string? FailureReason { get; set; }
    }
}
