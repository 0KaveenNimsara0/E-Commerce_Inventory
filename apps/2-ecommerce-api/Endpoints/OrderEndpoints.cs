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
    }
}
