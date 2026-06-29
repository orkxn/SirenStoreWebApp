using AutoMapper;
using BCrypt.Net;
using Entities.Models;
using FluentValidation;
using SirenStore.Application.DTOs;
using SirenStore.Application.Exceptions;
using SirenStore.Application.Interfaces;

namespace SirenStore.Application.Services
{
    public class UserManager : IUserService
    {
        private readonly IRepository<User> _userRepository;
        private readonly IMapper _mapper;
        private readonly IValidator<UpdateProfileDto> _updateProfileValidator;
        private readonly IValidator<ChangePasswordDto> _changePasswordValidator;
        public UserManager(IRepository<User> userRepository, IMapper mapper, IValidator<UpdateProfileDto> updateProfileValidator,
            IValidator<ChangePasswordDto> changePasswordValidator)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _updateProfileValidator = updateProfileValidator;
            _changePasswordValidator = changePasswordValidator;
        }

        // profil bilgilerini getirme
        public async Task<UserProfileDto> GetProfileAsync(long userId)
        {
            var user = await _userRepository.GetAsync(u => u.Id == userId && !u.IsDeleted);

            if (user == null)
                throw new NotFoundException("Kullanıcı profili bulunamadı.");

            return _mapper.Map<UserProfileDto>(user);
        }

        // profil bilgilerini güncelleme
        public async Task UpdateProfileAsync(long userId, UpdateProfileDto dto)
        {

            await _updateProfileValidator.ValidateAndThrowAsync(dto);

            var user = await _userRepository.GetAsync(u => u.Id == userId && !u.IsDeleted);

            if (user == null)
                throw new NotFoundException("Güncellenecek kullanıcı bulunamadı.");

            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.PhoneNumber = dto.PhoneNumber;

            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();
        }

        // güvenli şifre değiştirme
        public async Task ChangePasswordAsync(long userId, ChangePasswordDto dto)
        {
            await _changePasswordValidator.ValidateAndThrowAsync(dto);

            var user = await _userRepository.GetAsync(u => u.Id == userId && !u.IsDeleted);

            if (user == null)
                throw new NotFoundException("Kullanıcı bulunamadı.");

            bool isCurrentPasswordValid = BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash);

            if (!isCurrentPasswordValid)
                throw new BusinessRuleException("Mevcut şifrenizi hatalı girdiniz.");

            if (dto.CurrentPassword == dto.NewPassword)
                throw new BusinessRuleException("Yeni şifreniz eski şifrenizle aynı olamaz!");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();
        }
    }
}