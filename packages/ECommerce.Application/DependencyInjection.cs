using ECommerce.Application.Services;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace ECommerce.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);

        services.AddScoped<IProductService, ProductService>();
        services.AddScoped<ICustomerService, CustomerService>();
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<IStatsService, StatsService>();

        return services;
    }
}
