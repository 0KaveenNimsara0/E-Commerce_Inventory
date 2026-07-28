using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Application.Services;

public interface IOrderService
{
    Task<IEnumerable<OrderDto>> GetAllOrdersAsync(CancellationToken cancellationToken = default);
    Task<OrderDto?> GetOrderByIdAsync(Guid id, CancellationToken cancellationToken = default);
}

public class OrderService : IOrderService
{
    private readonly IApplicationDbContext _db;

    public OrderService(IApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync(CancellationToken cancellationToken = default)
    {
        var orders = await _db.Orders.AsNoTracking().ToListAsync(cancellationToken);
        return orders.Select(MapToDto);
    }

    public async Task<OrderDto?> GetOrderByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var order = await _db.Orders.FindAsync(new object[] { id }, cancellationToken);
        return order == null ? null : MapToDto(order);
    }

    private static OrderDto MapToDto(Order o) => new(
        o.Id,
        o.CustomerId,
        o.Status.ToString(),
        o.TotalAmount.Amount,
        o.TotalAmount.Currency,
        o.Items.Count,
        o.CreatedAt
    );
}
