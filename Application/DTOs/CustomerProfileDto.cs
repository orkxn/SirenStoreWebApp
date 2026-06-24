namespace SirenStore.Application.DTOs
{
    public record CustomerProfileDto(
    long Id,
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber,
    bool IsActive
    );
}