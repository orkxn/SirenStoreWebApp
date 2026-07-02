using Entities.Enums;
using Entities.Models;
using Microsoft.EntityFrameworkCore;
using SirenStore.Application.DTOs;
using SirenStore.Application.Exceptions;

namespace SirenStore.Application.Services
{
    public class AdminService
    {
        private readonly DbContext _context;
        private readonly AuditLogService _auditLogService;

        public AdminService(
            DbContext context, 
            AuditLogService auditLogService)
        {
            _context = context;
            _auditLogService = auditLogService;
        }

        // sistemdeki tüm kullanıcıları DTO ile listeler
        public async Task<List<UserManagementDto>> GetAllUsersAsync()
        {
            return await _context.Set<User>()
                .Select(u => new UserManagementDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    UserType = u.UserType,
                    IsDeleted = u.IsDeleted,
                    IsEmailConfirmed = u.IsEmailConfirmed
                })
                .ToListAsync();
        }

        // sistemdeki tüm satıcıları ve mağaza başvuru detaylarını listeler
        public async Task<List<SellerManagementDto>> GetAllSellersAsync()
        {
            return await _context.Set<Seller>()
                .Where(s => !s.IsDeleted)
                .Include(s => s.User) // satıcı ile ilişkili kullanıcıyı dahil et
                .Select(s => new SellerManagementDto
                {
                    Id = s.Id,
                    UserId = s.UserId,
                    UserEmail = s.User.Email,
                    StoreName = s.StoreName,
                    TaxNumber = s.TaxNumber,
                    TaxOffice = s.TaxOffice,
                    ContactEmail = s.ContactEmail,
                    ContactPhone = s.ContactPhone,
                    SupportLine = s.SupportLine,
                    Status = s.Status,
                    IsDeleted = s.IsDeleted
                })
                .ToListAsync();
        }

        // kullanıcıyı banlar (soft delete)
        public async Task BanUserAsync(long currentUserId, long targetUserId)
        {
            // kendini banlama koruması
            if (currentUserId == targetUserId)
                throw new BusinessRuleException("Kendi kendinizi banlayamazsınız!");

            var targetUser = await _context.Set<User>().FirstOrDefaultAsync(u => u.Id == targetUserId && !u.IsDeleted);
            if (targetUser == null)
                throw new NotFoundException("Kullanıcı bulunamadı.");

            // başka bir admini banlamaya çalışıyorsa hata fırlat
            if (targetUser.UserType == UserTypes.Admin)
                throw new BusinessRuleException("Bir admin başka bir admini banlayamaz!");

            // soft delete ile kullanıcıyı banla
            targetUser.IsDeleted = true;

            // eğer kullanıcının satıcı profili varsa onu da soft delete yap
            var seller = await _context.Set<Seller>()
                .FirstOrDefaultAsync(s => s.UserId == targetUserId);
            if (seller != null)
            {
                seller.IsDeleted = true;
            }

            await _context.SaveChangesAsync();

            // audit log: kullanıcı banlandı
            await _auditLogService.LogAuditAsync(currentUserId, "USER_BANNED", "User", targetUserId, 
                $"Banned by Admin {currentUserId}. User email: {targetUser.Email}");
        }

        // kullanıcının banını kaldırır
        public async Task UnbanUserAsync(long currentUserId, long targetUserId)
        {
            // kendi kendini unbanlama koruması
            if (currentUserId == targetUserId)
                throw new BusinessRuleException("Kendi kendinizi unbanlayamazsınız!");

            var user = await _context.Set<User>()
                .FirstOrDefaultAsync(u => u.Id == targetUserId);

            if (user == null)
                throw new NotFoundException("Kullanıcı bulunamadı.");

            // kullanıcının banını aç
            user.IsDeleted = false;

            // eğer kullanıcının satıcı profili varsa onun da banını kaldır
            var seller = await _context.Set<Seller>()
                .FirstOrDefaultAsync(s => s.UserId == targetUserId);
            if (seller != null)
            {
                seller.IsDeleted = false;
            }

            await _context.SaveChangesAsync();

            // audit: Log user unban
            await _auditLogService.LogAuditAsync(currentUserId, "USER_UNBANNED", "User", targetUserId, 
                $"Unbanned by Admin {currentUserId}. User email: {user.Email}");
        }
    }
}