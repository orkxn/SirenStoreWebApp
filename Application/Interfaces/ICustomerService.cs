using SirenStore.Application.DTOs;

namespace SirenStore.Application.Interfaces
{
    public interface ICustomerService
    {
        Task RegisterCustomerAsync(RegisterCustomerDto dto);

        Task<CustomerProfileDto> GetProfileByIdAsync(long customerId);
        Task UpdateProfileAsync(long customerId, UpdateCustomerProfileDto dto);

        Task RequestToBecomeSellerAsync(long customerId, BecomeSellerRequestDto dto);
    }
}