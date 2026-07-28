using ECommerce.Domain.Entities;
using ECommerce.Domain.ValueObjects;
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
// Prefer an environment variable or user secret, and avoid hardcoded credentials.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection");

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("Missing PostgreSQL connection string. Set ConnectionStrings__DefaultConnection or ConnectionStrings:DefaultConnection in your environment/user secrets.");
}

builder.Services.AddDbContext<ECommerceDbContext>(options =>
    options.UseNpgsql(connectionString));

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

// Ensure database schema is created on startup (no seed data — all data comes from API calls)
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

// --- API ENDPOINTS FOR FRONTEND ---

// Get Inventory / Products
app.MapGet("/api/inventory", async (ECommerceDbContext db) =>
{
    var products = await db.Products.AsNoTracking().ToListAsync();
    var mapped = products.Select(p => new
    {
        id = p.Id,
        name = p.Name,
        description = p.Description,
        price = p.Price.Amount,
        currency = p.Price.Currency,
        stockQuantity = p.StockQuantity,
        isActive = p.IsActive
    });
    return Results.Ok(mapped);
});

// Get Inventory & Revenue Stats
app.MapGet("/api/stats", async (ECommerceDbContext db) =>
{
    var totalProducts = await db.Products.CountAsync();
    var pendingOrders = await db.Orders.CountAsync(o => o.Status == ECommerce.Domain.Enums.OrderStatus.Pending);
    var totalCustomers = await db.Customers.CountAsync();
    
    var orders = await db.Orders.Include(o => o.Items).ToListAsync();
    var totalRevenue = orders.Sum(o => o.TotalAmount.Amount);

    return Results.Ok(new
    {
        totalProducts,
        pendingOrders,
        totalCustomers,
        totalRevenue
    });
});

// Add New Product
app.MapPost("/api/inventory", async (ProductDto dto, ECommerceDbContext db) =>
{
    var product = new Product(dto.Name, dto.Description, new Money(dto.Price), dto.StockQuantity);
    db.Products.Add(product);
    await db.SaveChangesAsync();
    return Results.Created($"/api/inventory/{product.Id}", new
    {
        id = product.Id,
        name = product.Name,
        description = product.Description,
        price = product.Price.Amount,
        currency = product.Price.Currency,
        stockQuantity = product.StockQuantity,
        isActive = product.IsActive
    });
});

// Update Product
app.MapPut("/api/inventory/{id:guid}", async (Guid id, UpdateProductDto dto, ECommerceDbContext db) =>
{
    var product = await db.Products.FindAsync(id);
    if (product == null)
    {
        return Results.NotFound(new { message = $"Product with ID {id} not found." });
    }

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

    await db.SaveChangesAsync();

    return Results.Ok(new
    {
        id = product.Id,
        name = product.Name,
        description = product.Description,
        price = product.Price.Amount,
        currency = product.Price.Currency,
        stockQuantity = product.StockQuantity,
        isActive = product.IsActive
    });
});

// Delete Product
app.MapDelete("/api/inventory/{id:guid}", async (Guid id, ECommerceDbContext db) =>
{
    var product = await db.Products.FindAsync(id);
    if (product == null)
    {
        return Results.NotFound(new { message = $"Product with ID {id} not found." });
    }

    db.Products.Remove(product);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Get Orders
app.MapGet("/api/orders", async (ECommerceDbContext db) =>
{
    var orders = await db.Orders.AsNoTracking().ToListAsync();
    var mapped = orders.Select(o => new
    {
        id = o.Id,
        customerId = o.CustomerId,
        status = o.Status.ToString(),
        totalAmount = o.TotalAmount.Amount,
        currency = o.TotalAmount.Currency,
        itemsCount = o.Items.Count,
        createdAt = o.CreatedAt
    });
    return Results.Ok(mapped);
});

// Get Customers
app.MapGet("/api/customers", async (ECommerceDbContext db) =>
{
    var customers = await db.Customers.AsNoTracking().ToListAsync();
    var mapped = customers.Select(c => new
    {
        id = c.Id,
        firstName = c.FirstName,
        lastName = c.LastName,
        fullName = c.FullName,
        email = c.Email,
        isActive = c.IsActive
    });
    return Results.Ok(mapped);
});

// Add Customer
app.MapPost("/api/customers", async (CustomerDto dto, ECommerceDbContext db) =>
{
    var customer = new Customer(dto.FirstName, dto.LastName, dto.Email, dto.IsActive);
    db.Customers.Add(customer);
    await db.SaveChangesAsync();
    return Results.Created($"/api/customers/{customer.Id}", new
    {
        id = customer.Id,
        firstName = customer.FirstName,
        lastName = customer.LastName,
        fullName = customer.FullName,
        email = customer.Email,
        isActive = customer.IsActive
    });
});

// Update Customer
app.MapPut("/api/customers/{id:guid}", async (Guid id, CustomerDto dto, ECommerceDbContext db) =>
{
    var customer = await db.Customers.FindAsync(id);
    if (customer == null)
    {
        return Results.NotFound(new { message = $"Customer with ID {id} not found." });
    }

    customer.UpdateDetails(dto.FirstName, dto.LastName, dto.Email);

    if (dto.IsActive && !customer.IsActive)
    {
        customer.Activate();
    }
    else if (!dto.IsActive && customer.IsActive)
    {
        customer.Deactivate();
    }

    await db.SaveChangesAsync();

    return Results.Ok(new
    {
        id = customer.Id,
        firstName = customer.FirstName,
        lastName = customer.LastName,
        fullName = customer.FullName,
        email = customer.Email,
        isActive = customer.IsActive
    });
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

record ProductDto(string Name, string Description, decimal Price, int StockQuantity);
record UpdateProductDto(string Name, string Description, decimal Price, int StockQuantity, bool IsActive);
record CustomerDto(string FirstName, string LastName, string Email, bool IsActive = true);

