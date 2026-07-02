using Entities.Models;
using SirenStore.Application.DTOs;

namespace SirenStore.Application.Interfaces
{
    /// <summary>
    /// Audit logging interface for tracking sensitive operations
    /// </summary>
    public interface IAuditLogService
    {
        /// <summary>
        /// Log a sensitive operation to the AuditLog table
        /// </summary>
        /// <param name="userId">ID of the user performing the operation (nullable for system operations)</param>
        /// <param name="action">The action being performed (e.g., "USER_BAN", "USER_LOGIN")</param>
        /// <param name="entityName">Name of the entity being modified (e.g., "User", "Seller")</param>
        /// <param name="entityId">ID of the entity being modified</param>
        /// <param name="details">Additional details about the operation</param>
        Task LogAuditAsync(long? userId, string action, string entityName, long entityId, string? details = null);

        /// <summary>
        /// Tüm audit loglarını tarihe göre azalan sırada getirir (admin paneli için)
        /// </summary>
        Task<List<AuditLogDto>> GetAllAuditLogsAsync();
    }
}
