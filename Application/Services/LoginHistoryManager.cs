using Entities.Models;
using Microsoft.Extensions.Logging;
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
    }
}
