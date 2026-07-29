using ECommerce.Application.DTOs;
using ECommerce.Application.Services;

namespace ECommerce.Api.Endpoints;

public static class OrderEndpoints
{
    public static void MapOrderEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/orders")
            .WithTags("Orders");

        group.MapGet("/", async (IOrderService orderService) =>
        {
            var orders = await orderService.GetAllOrdersAsync();
            return Results.Ok(orders);
        });

        group.MapGet("/{id:guid}", async (Guid id, IOrderService orderService) =>
        {
            var order = await orderService.GetOrderDetailAsync(id);
            return order != null ? Results.Ok(order) : Results.NotFound(new { message = $"Order with ID {id} not found." });
        });

        group.MapPost("/", async (CreateOrderDto dto, IOrderService orderService) =>
        {
            var order = await orderService.CreateOrderAsync(dto);
            return Results.Created($"/api/orders/{order.Id}", order);
        });

        group.MapPut("/{id:guid}/status", async (Guid id, UpdateOrderStatusDto dto, IOrderService orderService) =>
        {
            var order = await orderService.UpdateOrderStatusAsync(id, dto);
            return order != null ? Results.Ok(order) : Results.NotFound(new { message = $"Order with ID {id} not found." });
        });

        group.MapDelete("/{id:guid}", async (Guid id, IOrderService orderService) =>
        {
            var cancelled = await orderService.CancelOrderAsync(id);
            return cancelled ? Results.NoContent() : Results.NotFound(new { message = $"Order with ID {id} not found." });
        });
    }
}
