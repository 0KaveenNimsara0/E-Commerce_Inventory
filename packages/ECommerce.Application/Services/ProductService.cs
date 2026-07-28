using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;
using ECommerce.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Application.Services;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetAllProductsAsync(CancellationToken cancellationToken = default);
    Task<ProductDto?> GetProductByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ProductDto> CreateProductAsync(CreateProductDto dto, CancellationToken cancellationToken = default);
    Task<ProductDto?> UpdateProductAsync(Guid id, UpdateProductDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteProductAsync(Guid id, CancellationToken cancellationToken = default);
}

public class ProductService : IProductService
{
    private readonly IApplicationDbContext _db;

    public ProductService(IApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<ProductDto>> GetAllProductsAsync(CancellationToken cancellationToken = default)
    {
        var products = await _db.Products.AsNoTracking().ToListAsync(cancellationToken);
        return products.Select(MapToDto);
    }

    public async Task<ProductDto?> GetProductByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var product = await _db.Products.FindAsync(new object[] { id }, cancellationToken);
        return product == null ? null : MapToDto(product);
    }

    public async Task<ProductDto> CreateProductAsync(CreateProductDto dto, CancellationToken cancellationToken = default)
    {
        var product = new Product(dto.Name, dto.Description, new Money(dto.Price), dto.StockQuantity);
        _db.Products.Add(product);
        await _db.SaveChangesAsync(cancellationToken);
        return MapToDto(product);
    }

    public async Task<ProductDto?> UpdateProductAsync(Guid id, UpdateProductDto dto, CancellationToken cancellationToken = default)
    {
        var product = await _db.Products.FindAsync(new object[] { id }, cancellationToken);
        if (product == null) return null;

        product.UpdateDetails(dto.Name, dto.Description, new Money(dto.Price));

        if (dto.StockQuantity > product.StockQuantity)
        {
            product.AddStock(dto.StockQuantity - product.StockQuantity);
        }
        else if (dto.StockQuantity < product.StockQuantity)
        {
            product.RemoveStock(product.StockQuantity - dto.StockQuantity);
        }

        if (dto.IsActive && !product.IsActive)
        {
            product.Activate();
        }
        else if (!dto.IsActive && product.IsActive)
        {
            product.Deactivate();
        }

        await _db.SaveChangesAsync(cancellationToken);
        return MapToDto(product);
    }

    public async Task<bool> DeleteProductAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var product = await _db.Products.FindAsync(new object[] { id }, cancellationToken);
        if (product == null) return false;

        _db.Products.Remove(product);
        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static ProductDto MapToDto(Product p) => new(
        p.Id,
        p.Name,
        p.Description,
        p.Price.Amount,
        p.Price.Currency,
        p.StockQuantity,
        p.IsActive
    );
}
