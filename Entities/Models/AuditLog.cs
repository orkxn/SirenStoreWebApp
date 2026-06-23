namespace Entities.Models
{
    public class AuditLog : BaseModel
    {
        public long? UserId { get; set; }
        public string UserEmail { get; set; }
        public string Action { get; set; }
        public string EntityName { get; set; }
        public long? EntityId { get; set; }
        public string? OldValues { get; set; }
        public string? NewValues { get; set; }
        public string? IpAddress { get; set; }
    }
}
