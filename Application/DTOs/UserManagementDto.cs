using Entities.Enums;
using Entities.Models;

namespace SirenStore.Application.DTOs
{
    public class UserManagementDto
    {
        public long Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public UserTypes UserType { get; set; } // kullanıcı tipi
        public bool IsDeleted { get; set; } // banlı mı değil mi
    }
}