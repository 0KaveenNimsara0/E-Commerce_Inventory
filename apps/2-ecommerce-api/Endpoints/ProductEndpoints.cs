using ECommerce.Application.DTOs;
using ECommerce.Application.Services;

namespace ECommerce.Api.Endpoints;

public static class ProductEndpoints
{
    public static void MapProductEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/inventory")
            .WithTags("Products");

        group.MapGet("/", async (IProductService productService) =>
        {
            var products = await productService.GetAllProductsAsync();
            return Results.Ok(products);
        });

        group.MapPost("/", async (CreateProductDto dto, IProductService productService) =>
        {
            var product = await productService.CreateProductAsync(dto);
            return Results.Created($"/api/inventory/{product.Id}", product);
        });

        group.MapPut("/{id:guid}", async (Guid id, UpdateProductDto dto, IProductService productService) =>
        {
            var product = await productService.UpdateProductAsync(id, dto);
            return product != null
                ? Results.Ok(product)
                : Results.NotFound(new { message = $"Product with ID {id} not found." });
        });

        group.MapDelete("/{id:guid}", async (Guid id, IProductService productService) =>
        {
            var deleted = await productService.DeleteProductAsync(id);
            return deleted
                ? Results.NoContent()
                : Results.NotFound(new { message = $"Product with ID {id} not found." });
        });
    }
}
