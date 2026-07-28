namespace ECommerce.Application.DTOs;

public record OrderDto(
    Guid Id,
    Guid CustomerId,
    string Status,
    decimal TotalAmount,
    string Currency,
    int ItemsCount,
    DateTime CreatedAt
);
