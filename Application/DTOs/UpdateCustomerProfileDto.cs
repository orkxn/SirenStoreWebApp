namespace SirenStore.Application.DTOs
{
    public record UpdateCustomerProfileDto(
        string FirstName,
        string LastName,
        string PhoneNumber
    );
}