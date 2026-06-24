using AutoMapper;
using Entities.Models;
using Entities.Enums;
using FluentValidation;
using SirenStore.Application.DTOs;
using SirenStore.Application.Interfaces;

namespace SirenStore.Application.Services
{
    public class AdminManager(
        IRepository<User> userRepository,
        IMapper mapper,
        IValidator<CreateAdminDto> createAdminValidator) : IAdminService
    {
        public async Task<AdminDto?> GetAdminByIdAsync(long id)
        {
            var user = await userRepository.GetByIdAsync(id);

            if (user == null || (user.UserType != UserTypes.Admin && user.UserType != UserTypes.SuperAdmin))
            {
                return null;
            }

            // Burası artık MappingProfile'daki özel kurallara göre Username ve Role alanlarını dolduracak
            return mapper.Map<AdminDto>(user);
        }

        public async Task CreateAdminWithPasswordAsync(CreateAdminDto dto)
        {
            await createAdminValidator.ValidateAndThrowAsync(dto);

            // Burası gelen Username'i alıp User'ın FirstName alanına pürüzsüzce yazacak
            var user = mapper.Map<User>(dto);

            user.UserType = UserTypes.Admin;
            user.IsActive = true;
            user.IsEmailConfirmed = true;
            user.PasswordHash = FakePasswordHasher(dto.Password);

            await userRepository.AddAsync(user);
            await userRepository.SaveChangesAsync();
        }

        private string FakePasswordHasher(string password)
        {
            return $"hashed_{password}_siren_salt";
        }
    }
}