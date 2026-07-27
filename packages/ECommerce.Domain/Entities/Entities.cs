using ECommerce.Domain.Enums;

namespace ECommerce.Domain.Entities;

public class Order
{
    public Guid Id { get; set; }
    public string CustomerId { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class Product
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
}
