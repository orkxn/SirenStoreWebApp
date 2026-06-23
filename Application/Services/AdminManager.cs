using AutoMapper;
using Entities.Models;
using Entities.Enums; 
using SirenStore.Application.DTOs;
using SirenStore.Application.Interfaces;

namespace SirenStore.Application.Services
{
    // Bağımlılığı IRepository<User> olarak güncelledik
    public class AdminManager(IRepository<User> userRepository, IMapper mapper) : IAdminService
    {
        public async Task<AdminDto?> GetAdminByIdAsync(long id)
        {
            var user = await userRepository.GetByIdAsync(id);

            // İş Mantığı Kontrolü: Kullanıcı yoksa veya tipi Admin/SuperAdmin değilse erişimi engelle
            if (user == null || (user.UserType != UserTypes.Admin && user.UserType != UserTypes.SuperAdmin))
            {
                return null;
            }

            return mapper.Map<AdminDto>(user);
        }

        public async Task CreateAdminWithPasswordAsync(CreateAdminDto dto)
        {
            // Gelen DTO'yu User entity nesnesine dönüştürüyoruz
            var user = mapper.Map<User>(dto);

            // İş Mantığı Kuralları:
            user.UserType = UserTypes.Admin; // Bu metotla eklenen herkesin tipi zorunlu olarak Admin mühürlenir
            user.IsActive = true;
            user.IsEmailConfirmed = true;   // Admin manuel eklendiği için e-posta onayını true geçebiliriz
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