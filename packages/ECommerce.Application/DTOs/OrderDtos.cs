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

public record OrderItemDto(
    Guid ProductId,
    string ProductName,
    decimal UnitPrice,
    string Currency,
    int Quantity,
    decimal SubTotal
);

public record OrderDetailDto(
    Guid Id,
    Guid CustomerId,
    string CustomerName,
    string Status,
    decimal TotalAmount,
    string Currency,
    IReadOnlyList<OrderItemDto> Items,
    DateTime CreatedAt
);

public record CreateOrderItemDto(
    Guid ProductId,
    int Quantity
);

public record CreateOrderDto(
    Guid CustomerId,
    List<CreateOrderItemDto> Items
);

public record UpdateOrderStatusDto(
    string Status
);
