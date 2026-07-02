using SirenStore.Application.DTOs;

namespace SirenStore.Application.Interfaces
{
    public interface ILoginHistoryService
    {
        Task RecordLoginAttemptAsync(long userId, string ipAddress, string? userAgent, bool isSuccessful, string? failureReason = null);

        /// <summary>
        /// Tüm giriş geçmişi kayıtlarını tarihe göre azalan sırada getirir (admin paneli için)
        /// </summary>
        Task<List<LoginHistoryDto>> GetAllLoginHistoriesAsync();
    }
}
