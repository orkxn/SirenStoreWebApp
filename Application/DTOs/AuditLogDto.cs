namespace SirenStore.Application.DTOs
{
    public record AuditLogDto(
        long Id,
        long? UserId,
        string UserEmail,
        string Action,
        string EntityName,
        long? EntityId,
        string? NewValues,
        string? IpAddress,
        DateTime CreationDate
    );
}
