using ECommerce.Domain.Common;
using ECommerce.Domain.Exceptions;
using ECommerce.Domain.ValueObjects;

namespace ECommerce.Domain.Entities;

public class Product : BaseEntity
{
    public string Name { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public Money Price { get; private set; } = Money.Zero();
    public int StockQuantity { get; private set; }
    public bool IsActive { get; private set; } = true;

    private Product() { } // EF Core

    public Product(string name, string description, Money price, int stockQuantity)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Product name cannot be empty.");

        Name = name.Trim();
        Description = description?.Trim() ?? string.Empty;
        Price = price ?? throw new ArgumentNullException(nameof(price));
        StockQuantity = stockQuantity >= 0 ? stockQuantity : throw new DomainException("Stock cannot be negative.");
    }

    public void UpdateDetails(string name, string description, Money price)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Product name cannot be empty.");

        Name = name.Trim();
        Description = description?.Trim() ?? string.Empty;
        Price = price ?? throw new ArgumentNullException(nameof(price));
        MarkUpdated();
    }

    public void AddStock(int quantity)
    {
        if (quantity <= 0)
            throw new DomainException("Quantity to add must be positive.");

        StockQuantity += quantity;
        MarkUpdated();
    }

    public void RemoveStock(int quantity)
    {
        if (quantity <= 0)
            throw new DomainException("Quantity to remove must be positive.");

        if (StockQuantity < quantity)
            throw new InsufficientStockException(Name, quantity, StockQuantity);

        StockQuantity -= quantity;
        MarkUpdated();
    }

    public void Deactivate()
    {
        IsActive = false;
        MarkUpdated();
    }

    public void Activate()
    {
        IsActive = true;
        MarkUpdated();
    }
}
