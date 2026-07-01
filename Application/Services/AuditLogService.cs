using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SirenStore.Application.DTOs;
using SirenStore.Application.Interfaces;

namespace SirenStore.Application.Services
{
    /// <summary>
    /// Service for logging sensitive operations to the AuditLog table
    /// Tracks who did what, when, and why for security and compliance
    /// </summary>
    public class AuditLogService : IAuditLogService
    {
        private readonly IRepository<AuditLog> _auditLogRepository;
        private readonly ILogger<AuditLogService> _logger;

        public AuditLogService(IRepository<AuditLog> auditLogRepository, ILogger<AuditLogService> logger)
        {
            _auditLogRepository = auditLogRepository;
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
                    UserEmail = userId.HasValue ? $"User_{userId}" : "System"
                };

                await _auditLogRepository.AddAsync(auditLog);
                await _auditLogRepository.SaveChangesAsync();

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
            return await _auditLogRepository.AsQueryable()
                .OrderByDescending(a => a.CreationDate)
                .Select(a => new AuditLogDto(
                    a.Id,
                    a.UserId,
                    a.UserEmail,
                    a.Action,
                    a.EntityName,
                    a.EntityId,
                    a.NewValues,
                    a.IpAddress,
                    a.CreationDate
                ))
                .ToListAsync();
        }
    }
}
