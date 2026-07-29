using ECommerce.Domain.Common;
using ECommerce.Domain.Enums;
using ECommerce.Domain.Exceptions;
using ECommerce.Domain.ValueObjects;

namespace ECommerce.Domain.Entities;

public class OrderItem : BaseEntity
{
    public Guid ProductId { get; private set; }
    public string ProductName { get; private set; } = string.Empty;
    public Money UnitPrice { get; private set; } = Money.Zero();
    public int Quantity { get; private set; }

    public Money SubTotal => UnitPrice.Multiply(Quantity);

    private OrderItem() { } // EF Core

    public OrderItem(Guid productId, string productName, Money unitPrice, int quantity)
    {
        if (quantity <= 0)
            throw new DomainException("Order item quantity must be greater than zero.");

        ProductId = productId;
        ProductName = productName;
        UnitPrice = unitPrice ?? throw new ArgumentNullException(nameof(unitPrice));
        Quantity = quantity;
    }
}

public class Order : BaseEntity
{
    public Guid CustomerId { get; private set; }
    public OrderStatus Status { get; private set; } = OrderStatus.Pending;
    
    private readonly List<OrderItem> _items = new();
    public IReadOnlyCollection<OrderItem> Items => _items.AsReadOnly();

    public Money TotalAmount
    {
        get
        {
            if (!_items.Any()) return Money.Zero();
            var currency = _items.First().UnitPrice.Currency;
            var total = _items.Sum(item => item.SubTotal.Amount);
            return new Money(total, currency);
        }
    }

    private Order() { } // EF Core

    public Order(Guid customerId)
    {
        CustomerId = customerId != Guid.Empty ? customerId : throw new DomainException("Invalid customer ID.");
        Status = OrderStatus.Pending;
    }

    public void AddItem(Guid productId, string productName, Money unitPrice, int quantity)
    {
        if (Status != OrderStatus.Pending)
            throw new InvalidOrderOperationException("Cannot modify items once order is no longer pending.");

        var existingItem = _items.FirstOrDefault(i => i.ProductId == productId);
        if (existingItem != null)
        {
            _items.Remove(existingItem);
            _items.Add(new OrderItem(productId, productName, unitPrice, existingItem.Quantity + quantity));
        }
        else
        {
            _items.Add(new OrderItem(productId, productName, unitPrice, quantity));
        }
        MarkUpdated();
    }

    public void MarkProcessing()
    {
        if (Status != OrderStatus.Pending)
            throw new InvalidOrderOperationException($"Cannot transition order from {Status} to Processing.");

        Status = OrderStatus.Processing;
        MarkUpdated();
    }

    public void MarkShipped()
    {
        if (Status != OrderStatus.Processing)
            throw new InvalidOrderOperationException($"Cannot transition order from {Status} to Shipped.");

        Status = OrderStatus.Shipped;
        MarkUpdated();
    }

    public void MarkDelivered()
    {
        if (Status != OrderStatus.Shipped)
            throw new InvalidOrderOperationException($"Cannot transition order from {Status} to Delivered.");

        Status = OrderStatus.Delivered;
        MarkUpdated();
    }

    public void Cancel()
    {
        if (Status == OrderStatus.Delivered || Status == OrderStatus.Shipped)
            throw new InvalidOrderOperationException("Cannot cancel an order that is already shipped or delivered.");

        Status = OrderStatus.Cancelled;
        MarkUpdated();
    }
}
