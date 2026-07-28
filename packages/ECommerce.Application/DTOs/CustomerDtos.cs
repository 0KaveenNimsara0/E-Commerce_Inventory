namespace ECommerce.Application.DTOs;

public record CustomerDto(
    Guid Id,
    string FirstName,
    string LastName,
    string FullName,
    string Email,
    bool IsActive
);

public record CreateCustomerDto(
    string FirstName,
    string LastName,
    string Email,
    bool IsActive = true
);

public record UpdateCustomerDto(
    string FirstName,
    string LastName,
    string Email,
    bool IsActive = true
);
