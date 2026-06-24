namespace SirenStore.Application.DTOs
{
    public record RegisterCustomerDto(
        string FirstName,
        string LastName,
        string Email,
        string Password,
        string PhoneNumber
    ); 
}