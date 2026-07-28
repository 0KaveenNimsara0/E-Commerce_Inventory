namespace ECommerce.Application.DTOs;

public record ProductDto(
    Guid Id,
    string Name,
    string Description,
    decimal Price,
    string Currency,
    int StockQuantity,
    bool IsActive
);

public record CreateProductDto(
    string Name,
    string Description,
    decimal Price,
    int StockQuantity
);

public record UpdateProductDto(
    string Name,
    string Description,
    decimal Price,
    int StockQuantity,
    bool IsActive
);
