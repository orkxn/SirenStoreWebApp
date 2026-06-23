namespace Entities.Models
{
    public class WarningRecord : BaseModel
    {
        public long UserId { get; set; }
        public User User { get; set; }

        public string Reason { get; set; }
        public string? Details { get; set; }
        public long WarnedByUserId { get; set; }
        public bool IsAcknowledged { get; set; }
        public DateTime? AcknowledgedDate { get; set; }
    }
}
