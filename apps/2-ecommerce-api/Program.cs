using ECommerce.Application;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.DTOs;
using ECommerce.Application.Services;
using ECommerce.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Ensure User Secrets are loaded in Development environment
if (builder.Environment.IsDevelopment())
{
    builder.Configuration.AddUserSecrets<Program>();
}

// Allow local secrets to be supplied through environment variables as well.
builder.Configuration.AddEnvironmentVariables();

// Configure PostgreSQL DbContext.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection");

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("Missing PostgreSQL connection string. Set ConnectionStrings__DefaultConnection or ConnectionStrings:DefaultConnection in your environment/user secrets.");
}

builder.Services.AddDbContext<ECommerceDbContext>(options =>
    options.UseNpgsql(connectionString));

// Register Application layer interfaces and services
builder.Services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ECommerceDbContext>());
builder.Services.AddApplicationServices();

// Enable CORS for frontend Vite storefront
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? new[] { "http://localhost:5173", "http://127.0.0.1:5173" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddOpenApi();

var app = builder.Build();

// Ensure database schema is created on startup
try
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<ECommerceDbContext>();
    db.Database.EnsureCreated();

    // Ensure newly added columns exist in existing PostgreSQL tables
    db.Database.ExecuteSqlRaw(@"
        ALTER TABLE ""Customers"" ADD COLUMN IF NOT EXISTS ""IsActive"" boolean NOT NULL DEFAULT TRUE;
        ALTER TABLE ""Products"" ADD COLUMN IF NOT EXISTS ""IsActive"" boolean NOT NULL DEFAULT TRUE;
    ");

    app.Logger.LogInformation("PostgreSQL database schema ready.");
}
catch (Exception ex)
{
    app.Logger.LogWarning(ex, "Could not connect to PostgreSQL on startup. Ensure PostgreSQL is running.");
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowFrontend");

// --- API ENDPOINTS USING APPLICATION LAYER SERVICES ---

// Products Endpoints
app.MapGet("/api/inventory", async (IProductService productService) =>
{
    var products = await productService.GetAllProductsAsync();
    return Results.Ok(products);
});

app.MapPost("/api/inventory", async (CreateProductDto dto, IProductService productService) =>
{
    var product = await productService.CreateProductAsync(dto);
    return Results.Created($"/api/inventory/{product.Id}", product);
});

app.MapPut("/api/inventory/{id:guid}", async (Guid id, UpdateProductDto dto, IProductService productService) =>
{
    var product = await productService.UpdateProductAsync(id, dto);
    return product != null ? Results.Ok(product) : Results.NotFound(new { message = $"Product with ID {id} not found." });
});

app.MapDelete("/api/inventory/{id:guid}", async (Guid id, IProductService productService) =>
{
    var deleted = await productService.DeleteProductAsync(id);
    return deleted ? Results.NoContent() : Results.NotFound(new { message = $"Product with ID {id} not found." });
});

// Customers Endpoints
app.MapGet("/api/customers", async (ICustomerService customerService) =>
{
    var customers = await customerService.GetAllCustomersAsync();
    return Results.Ok(customers);
});

app.MapPost("/api/customers", async (CreateCustomerDto dto, ICustomerService customerService) =>
{
    var customer = await customerService.CreateCustomerAsync(dto);
    return Results.Created($"/api/customers/{customer.Id}", customer);
});

app.MapPut("/api/customers/{id:guid}", async (Guid id, UpdateCustomerDto dto, ICustomerService customerService) =>
{
    var customer = await customerService.UpdateCustomerAsync(id, dto);
    return customer != null ? Results.Ok(customer) : Results.NotFound(new { message = $"Customer with ID {id} not found." });
});

// Orders Endpoints
app.MapGet("/api/orders", async (IOrderService orderService) =>
{
    var orders = await orderService.GetAllOrdersAsync();
    return Results.Ok(orders);
});

// System Stats Endpoint
app.MapGet("/api/stats", async (IStatsService statsService) =>
{
    var stats = await statsService.GetSystemStatsAsync();
    return Results.Ok(stats);
});

// Config Check Endpoint
app.MapGet("/config-check", (IConfiguration config) =>
{
    return Results.Ok(new
    {
        Environment = app.Environment.EnvironmentName,
        ConnectionString = config.GetConnectionString("DefaultConnection"),
        JwtIssuer = config["JwtSettings:Issuer"],
        HasJwtSecret = !string.IsNullOrEmpty(config["JwtSettings:Secret"]),
        HasStripeKey = !string.IsNullOrEmpty(config["ThirdPartyServices:StripeApiKey"])
    });
});

app.Run();
