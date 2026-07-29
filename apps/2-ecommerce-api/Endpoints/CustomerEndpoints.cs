using ECommerce.Application.DTOs;
using ECommerce.Application.Services;

namespace ECommerce.Api.Endpoints;

public static class CustomerEndpoints
{
    public static void MapCustomerEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/customers")
            .WithTags("Customers");

        group.MapGet("/", async (ICustomerService customerService) =>
        {
            var customers = await customerService.GetAllCustomersAsync();
            return Results.Ok(customers);
        });

        group.MapPost("/", async (CreateCustomerDto dto, ICustomerService customerService) =>
        {
            var customer = await customerService.CreateCustomerAsync(dto);
            return Results.Created($"/api/customers/{customer.Id}", customer);
        });

        group.MapPut("/{id:guid}", async (Guid id, UpdateCustomerDto dto, ICustomerService customerService) =>
        {
            var customer = await customerService.UpdateCustomerAsync(id, dto);
            return customer != null
                ? Results.Ok(customer)
                : Results.NotFound(new { message = $"Customer with ID {id} not found." });
        });
    }
}
