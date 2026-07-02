namespace Entities.Models
{
    public class BanRecord : BaseModel
    {
        public long UserId { get; set; }
        public User User { get; set; }

        public string Reason { get; set; }
        public DateTime BanStartDate { get; set; }
        public DateTime? BanEndDate { get; set; }
        public bool IsPermanent { get; set; }
        public long BannedByUserId { get; set; }
    }
}
