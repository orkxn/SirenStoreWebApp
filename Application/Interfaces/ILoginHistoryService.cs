namespace SirenStore.Application.Interfaces
{
    public interface ILoginHistoryService
    {
        Task RecordLoginAttemptAsync(long userId, string ipAddress, string? userAgent, bool isSuccessful, string? failureReason = null);
    }
}
