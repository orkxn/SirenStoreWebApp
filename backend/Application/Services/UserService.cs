using BCrypt.Net;
using Entities.Models;
using FluentValidation;
using SirenStore.Application.DTOs;
using SirenStore.Application.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace SirenStore.Application.Services
{
    public class UserService
    {
        private readonly DbContext _context;
        private readonly IValidator<UpdateProfileDto> _updateProfileValidator;
        private readonly IValidator<ChangePasswordDto> _changePasswordValidator;
        private readonly AuditLogService _auditLogService;

        public UserService(DbContext context, IValidator<UpdateProfileDto> updateProfileValidator,
            IValidator<ChangePasswordDto> changePasswordValidator, AuditLogService auditLogService)
        {
            _context = context;
            _updateProfileValidator = updateProfileValidator;
            _changePasswordValidator = changePasswordValidator;
            _auditLogService = auditLogService;
        }

        // profil bilgilerini getirme
        public async Task<UserProfileDto> GetProfileAsync(long userId)
        {
            var user = await _context.Set<User>().FirstOrDefaultAsync(u => u.Id == userId && !u.IsDeleted);

            if (user == null)
                throw new NotFoundException("Kullanıcı profili bulunamadı.");

            return new UserProfileDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                UserType = user.UserType,
                IsEmailConfirmed = user.IsEmailConfirmed
            };
        }

        // profil bilgilerini güncelleme
        public async Task UpdateProfileAsync(long userId, UpdateProfileDto dto)
        {
            await _updateProfileValidator.ValidateAndThrowAsync(dto);

            var user = await _context.Set<User>().FirstOrDefaultAsync(u => u.Id == userId && !u.IsDeleted);

            if (user == null)
                throw new NotFoundException("Güncellenecek kullanıcı bulunamadı.");

            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.PhoneNumber = dto.PhoneNumber;

            await _context.SaveChangesAsync();

            // audit: Profil güncelleme logu
            await _auditLogService.LogAuditAsync(userId, "USER_PROFILE_UPDATED", "User", userId, $"Email: {user.Email}");
        }

        // güvenli şifre değiştirme
        public async Task ChangePasswordAsync(long userId, ChangePasswordDto dto)
        {
            await _changePasswordValidator.ValidateAndThrowAsync(dto);

            var user = await _context.Set<User>().FirstOrDefaultAsync(u => u.Id == userId && !u.IsDeleted);

            if (user == null)
                throw new NotFoundException("Kullanıcı bulunamadı.");

            bool isCurrentPasswordValid = BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash);

            if (!isCurrentPasswordValid)
                throw new BusinessRuleException("Mevcut şifrenizi hatalı girdiniz.");

            if (dto.CurrentPassword == dto.NewPassword)
                throw new BusinessRuleException("Yeni şifreniz eski şifrenizle aynı olamaz!");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            await _context.SaveChangesAsync();

            // audit: Şifre değiştirme logu
            await _auditLogService.LogAuditAsync(userId, "USER_PASSWORD_CHANGED", "User", userId, $"Email: {user.Email}");
        }
    }
}