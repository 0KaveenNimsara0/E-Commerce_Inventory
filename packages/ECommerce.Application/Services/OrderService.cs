using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Application.Services;

public interface IOrderService
{
    Task<IEnumerable<OrderDto>> GetAllOrdersAsync(CancellationToken cancellationToken = default);
    Task<OrderDetailDto?> GetOrderDetailAsync(Guid id, CancellationToken cancellationToken = default);
    Task<OrderDetailDto> CreateOrderAsync(CreateOrderDto dto, CancellationToken cancellationToken = default);
    Task<OrderDetailDto?> UpdateOrderStatusAsync(Guid id, UpdateOrderStatusDto dto, CancellationToken cancellationToken = default);
    Task<bool> CancelOrderAsync(Guid id, CancellationToken cancellationToken = default);
}

public class OrderService : IOrderService
{
    private readonly IApplicationDbContext _db;
    private readonly IValidator<CreateOrderDto> _createOrderValidator;
    private readonly IValidator<UpdateOrderStatusDto> _updateOrderStatusValidator;

    public OrderService(
        IApplicationDbContext db,
        IValidator<CreateOrderDto> createOrderValidator,
        IValidator<UpdateOrderStatusDto> updateOrderStatusValidator)
    {
        _db = db;
        _createOrderValidator = createOrderValidator;
        _updateOrderStatusValidator = updateOrderStatusValidator;
    }

    public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync(CancellationToken cancellationToken = default)
    {
        var orders = await _db.Orders.Include(o => o.Items).AsNoTracking().ToListAsync(cancellationToken);
        return orders.Select(MapToDto);
    }

    public async Task<OrderDetailDto?> GetOrderDetailAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var order = await _db.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);

        if (order == null) return null;

        var customer = await _db.Customers.FindAsync(new object[] { order.CustomerId }, cancellationToken);
        var customerName = customer?.FullName ?? "Unknown Customer";

        return MapToDetailDto(order, customerName);
    }

    public async Task<OrderDetailDto> CreateOrderAsync(CreateOrderDto dto, CancellationToken cancellationToken = default)
    {
        await _createOrderValidator.ValidateAndThrowAsync(dto, cancellationToken);

        var customer = await _db.Customers.FindAsync(new object[] { dto.CustomerId }, cancellationToken);
        if (customer == null || !customer.IsActive)
            throw new ApplicationException("Customer not found or inactive.");

        var order = new Order(customer.Id);

        foreach (var itemDto in dto.Items)
        {
            var product = await _db.Products.FindAsync(new object[] { itemDto.ProductId }, cancellationToken);
            if (product == null || !product.IsActive)
                throw new ApplicationException($"Product {itemDto.ProductId} not found or inactive.");
            
            product.RemoveStock(itemDto.Quantity);
            order.AddItem(product.Id, product.Name, product.Price, itemDto.Quantity);
        }

        _db.Orders.Add(order);
        await _db.SaveChangesAsync(cancellationToken);

        return MapToDetailDto(order, customer.FullName);
    }

    public async Task<OrderDetailDto?> UpdateOrderStatusAsync(Guid id, UpdateOrderStatusDto dto, CancellationToken cancellationToken = default)
    {
        await _updateOrderStatusValidator.ValidateAndThrowAsync(dto, cancellationToken);

        var order = await _db.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == id, cancellationToken);
        if (order == null) return null;

        switch (dto.Status)
        {
            case "Processing":
                order.MarkProcessing();
                break;
            case "Shipped":
                order.MarkShipped();
                break;
            case "Delivered":
                order.MarkDelivered();
                break;
            case "Cancelled":
                order.Cancel();
                break;
        }

        await _db.SaveChangesAsync(cancellationToken);

        var customer = await _db.Customers.FindAsync(new object[] { order.CustomerId }, cancellationToken);
        var customerName = customer?.FullName ?? "Unknown Customer";

        return MapToDetailDto(order, customerName);
    }

    public async Task<bool> CancelOrderAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var order = await _db.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == id, cancellationToken);
        if (order == null) return false;

        order.Cancel();

        foreach (var item in order.Items)
        {
            var product = await _db.Products.FindAsync(new object[] { item.ProductId }, cancellationToken);
            if (product != null)
            {
                product.AddStock(item.Quantity);
            }
        }

        await _db.SaveChangesAsync(cancellationToken);
        return true;
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

    private static OrderDetailDto MapToDetailDto(Order o, string customerName) => new(
        o.Id,
        o.CustomerId,
        customerName,
        o.Status.ToString(),
        o.TotalAmount.Amount,
        o.TotalAmount.Currency,
        o.Items.Select(i => new OrderItemDto(
            i.ProductId,
            i.ProductName,
            i.UnitPrice.Amount,
            i.UnitPrice.Currency,
            i.Quantity,
            i.SubTotal.Amount
        )).ToList(),
        o.CreatedAt
    );
}
