namespace Entities.Models
{
    public class ExceptionLog : BaseModel
    {
        public string ExceptionType { get; set; }
        public string Message { get; set; }
        public string? StackTrace { get; set; }
        public string? Source { get; set; }
        public string? RequestPath { get; set; }
        public string? RequestMethod { get; set; }
        public string? QueryString { get; set; }
        public long? UserId { get; set; }
        public string? IpAddress { get; set; }
    }
}
