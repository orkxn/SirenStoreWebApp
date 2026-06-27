using Entities.Enums;
using Entities.Models;
using Microsoft.EntityFrameworkCore;
using SirenStore.Application.DTOs;
using SirenStore.Application.Exceptions;
using SirenStore.Application.Interfaces;

namespace SirenStore.Application.Services
{
    public class AdminManager : IAdminService
    {
        private readonly IRepository<User> _userRepository;
        private readonly IRepository<Seller> _sellerRepository;
        private readonly IAuditLogService _auditLogService;

        public AdminManager(
            IRepository<User> userRepository, 
            IRepository<Seller> sellerRepository,
            IAuditLogService auditLogService)
        {
            _userRepository = userRepository;
            _sellerRepository = sellerRepository;
            _auditLogService = auditLogService;
        }

        // Sistemdeki tüm kullanıcıları (Müşteri, Satıcı, Admin) güvenli DTO ile listeler
        public async Task<List<UserManagementDto>> GetAllUsersAsync()
        {
            return await _userRepository.AsQueryable()
                .Select(u => new UserManagementDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    UserType = u.UserType,
                    IsDeleted = u.IsDeleted
                })
                .ToListAsync();
        }

        // Sistemdeki tüm satıcıları ve mağaza başvuru detaylarını listeler
        public async Task<List<SellerManagementDto>> GetAllSellersAsync()
        {
            return await _sellerRepository.AsQueryable()
                .Include(s => s.User) // Satıcının kullanıcı bilgilerine (Email) erişmek için Join yapıyoruz
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

        // Kullanıcıyı banlar (Soft Delete)
        public async Task BanUserAsync(long currentUserId, long targetUserId)
        {
            // 1. Kendi kendini banlama koruması
            if (currentUserId == targetUserId)
                throw new BusinessRuleException("Kendi kendinizi banlayamazsınız!");

            var targetUser = await _userRepository.GetAsync(u => u.Id == targetUserId);
            if (targetUser == null)
                throw new NotFoundException("Kullanıcı bulunamadı.");

            // 2. Başka bir admini banlama koruması
            if (targetUser.UserType == UserTypes.Admin)
                throw new BusinessRuleException("Bir admin başka bir admini banlayamaz!");

            // Soft-delete işlemi
            targetUser.IsDeleted = true;
            _userRepository.Update(targetUser);
            await _userRepository.SaveChangesAsync();

            // Audit: Log user ban
            await _auditLogService.LogAuditAsync(currentUserId, "USER_BANNED", "User", targetUserId, 
                $"Banned by Admin {currentUserId}. User email: {targetUser.Email}");
        }

        // Kullanıcının banını kaldırır
        public async Task UnbanUserAsync(long currentUserId, long targetUserId)
        {
            // 1. Kendi kendini unbanlama koruması
            if (currentUserId == targetUserId)
                throw new BusinessRuleException("Kendi kendinizi unbanlayamazsınız!");

            var user = await _userRepository.AsQueryable()
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(u => u.Id == targetUserId);

            if (user == null)
                throw new NotFoundException("Kullanıcı bulunamadı.");

            // Kullanıcının banını aç (Soft-delete'i geri al)
            user.IsDeleted = false;

            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();

            // Audit: Log user unban
            await _auditLogService.LogAuditAsync(currentUserId, "USER_UNBANNED", "User", targetUserId, 
                $"Unbanned by Admin {currentUserId}. User email: {user.Email}");
        }
    }
}