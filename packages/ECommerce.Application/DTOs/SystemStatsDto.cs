namespace ECommerce.Application.DTOs;

public record SystemStatsDto(
    int TotalProducts,
    int PendingOrders,
    int TotalCustomers,
    decimal TotalRevenue
);
