using ECommerce.Domain.Entities;
using ECommerce.Domain.Exceptions;
using ECommerce.Domain.ValueObjects;
using Xunit;

namespace ECommerce.Domain.Tests;

public class ProductTests
{
    [Fact]
    public void Product_Creation_WithValidData_Succeeds()
    {
        // Arrange & Act
        var product = new Product("Gaming Laptop", "High performance laptop", new Money(1200m, "USD"), 10);

        // Assert
        Assert.Equal("Gaming Laptop", product.Name);
        Assert.Equal(1200m, product.Price.Amount);
        Assert.Equal(10, product.StockQuantity);
        Assert.True(product.IsActive);
    }

    [Fact]
    public void Product_RemoveStock_DecreasesQuantity()
    {
        // Arrange
        var product = new Product("Smartphone", "Latest model", new Money(800m), 15);

        // Act
        product.RemoveStock(5);

        // Assert
        Assert.Equal(10, product.StockQuantity);
    }

    [Fact]
    public void Product_RemoveStock_ExceedingAvailable_ThrowsInsufficientStockException()
    {
        // Arrange
        var product = new Product("Headphones", "Noise cancelling", new Money(150m), 3);

        // Act & Assert
        Assert.Throws<InsufficientStockException>(() => product.RemoveStock(5));
    }
}
