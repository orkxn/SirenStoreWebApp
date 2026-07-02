namespace SirenStore.Application.DTOs
{
    public record LoginHistoryDto(
        long Id,
        long UserId,
        string IpAddress,
        string? UserAgent,
        bool IsSuccessful,
        string? FailureReason,
        DateTime CreationDate
    );
}
