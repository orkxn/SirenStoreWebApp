using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SirenStore.Application.DTOs;
using SirenStore.Application.Interfaces;

namespace SirenStore.Application.Services
{
    public class LoginHistoryManager : ILoginHistoryService
    {
        private readonly IRepository<LoginHistory> _loginHistoryRepository;
        private readonly ILogger<LoginHistoryManager> _logger;

        public LoginHistoryManager(IRepository<LoginHistory> loginHistoryRepository, ILogger<LoginHistoryManager> logger)
        {
            _loginHistoryRepository = loginHistoryRepository;
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
                    FailureReason = failureReason
                };

                await _loginHistoryRepository.AddAsync(record);
                await _loginHistoryRepository.SaveChangesAsync();
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
            return await _loginHistoryRepository.AsQueryable()
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
