using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SirenStore.Application.DTOs;

namespace SirenStore.Application.Services
{
    public class LoginHistoryService
    {
        private readonly DbContext _context;
        private readonly ILogger<LoginHistoryService> _logger;

        public LoginHistoryService(DbContext context, ILogger<LoginHistoryService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task RecordLoginAttemptAsync(long userId, string ipAddress, string? userAgent, bool isSuccessful, string? failureReason = null)
        {
            try
            {
                var record = new LoginHistory
                {
                    UserId = userId,
                    IpAddress = ipAddress,
                    UserAgent = userAgent,
                    IsSuccessful = isSuccessful,
                    FailureReason = failureReason,
                    CreationDate = DateTime.UtcNow
                };

                await _context.Set<LoginHistory>().AddAsync(record);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to record login attempt for UserId:{UserId}", userId);
            }
        }

        /// <summary>
        /// Tüm giriş geçmişi kayıtlarını tarihe göre azalan sırada getirir (admin paneli için)
        /// </summary>
        public async Task<List<LoginHistoryDto>> GetAllLoginHistoriesAsync()
        {
            return await _context.Set<LoginHistory>()
                .OrderByDescending(l => l.CreationDate)
                .Select(l => new LoginHistoryDto(
                    l.Id,
                    l.UserId,
                    l.IpAddress,
                    l.UserAgent,
                    l.IsSuccessful,
                    l.FailureReason,
                    l.CreationDate
                ))
                .ToListAsync();
        }
    }
}
