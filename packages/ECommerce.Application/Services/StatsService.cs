using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.DTOs;
using ECommerce.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Application.Services;

public interface IStatsService
{
    Task<SystemStatsDto> GetSystemStatsAsync(CancellationToken cancellationToken = default);
}

public class StatsService : IStatsService
{
    private readonly IApplicationDbContext _db;

    public StatsService(IApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<SystemStatsDto> GetSystemStatsAsync(CancellationToken cancellationToken = default)
    {
        var totalProducts = await _db.Products.CountAsync(cancellationToken);
        var pendingOrders = await _db.Orders.CountAsync(o => o.Status == OrderStatus.Pending, cancellationToken);
        var totalCustomers = await _db.Customers.CountAsync(cancellationToken);

        var orders = await _db.Orders.Include(o => o.Items).ToListAsync(cancellationToken);
        var totalRevenue = orders.Sum(o => o.TotalAmount.Amount);

        return new SystemStatsDto(
            totalProducts,
            pendingOrders,
            totalCustomers,
            totalRevenue
        );
    }
}
