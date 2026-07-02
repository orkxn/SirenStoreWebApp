using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SirenStore.Application.DTOs;

namespace SirenStore.Application.Services
{
    /// <summary>
    /// Service for logging sensitive operations to the AuditLog table
    /// Tracks who did what, when, and why for security and compliance
    /// </summary>
    public class AuditLogService
    {
        private readonly DbContext _context;
        private readonly ILogger<AuditLogService> _logger;

        public AuditLogService(DbContext context, ILogger<AuditLogService> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Log a sensitive operation to the audit table
        /// </summary>
        public async Task LogAuditAsync(long? userId, string action, string entityName, long entityId, string? details = null)
        {
            try
            {
                var auditLog = new AuditLog
                {
                    UserId = userId,
                    Action = action,
                    EntityName = entityName,
                    EntityId = entityId,
                    NewValues = details,
                    UserEmail = userId.HasValue ? $"User_{userId}" : "System",
                    CreationDate = DateTime.UtcNow
                };

                await _context.Set<AuditLog>().AddAsync(auditLog);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Audit logged: {action} on {entityName}:{entityId} by User:{userId}");
            }
            catch (Exception ex)
            {
                // Log audit failures but don't throw - operations should continue even if logging fails
                _logger.LogError(ex, $"Failed to log audit: {action} on {entityName}:{entityId}");
            }
        }

        /// <summary>
        /// Tüm audit loglarını tarihe göre azalan sırada getirir (admin paneli için)
        /// </summary>
        public async Task<List<AuditLogDto>> GetAllAuditLogsAsync()
        {
            return await _context.Set<AuditLog>()
                .OrderByDescending(a => a.CreationDate)
                .Select(a => new AuditLogDto(
                    a.Id,
                    a.UserId,
                    a.UserEmail,
                    a.Action,
                    a.EntityName,
                    a.EntityId,
                    a.NewValues,
                    null,
                    a.CreationDate
                ))
                .ToListAsync();
        }
    }
}
