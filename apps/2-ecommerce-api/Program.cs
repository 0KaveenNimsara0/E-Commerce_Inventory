using ECommerce.Api.Endpoints;
using ECommerce.Application;
using ECommerce.Application.Common.Interfaces;
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

builder.Services.AddProblemDetails();
builder.Services.AddOpenApi();

var app = builder.Build();

// Global Exception & RFC 7807 ProblemDetails Middleware
app.UseExceptionHandler(exceptionHandlerApp =>
{
    exceptionHandlerApp.Run(async context =>
    {
        var exceptionHandlerFeature = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>();
        if (exceptionHandlerFeature?.Error is null) return;

        var exception = exceptionHandlerFeature.Error;

        context.Response.ContentType = "application/problem+json";

        if (exception is FluentValidation.ValidationException valEx)
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            var errors = valEx.Errors.GroupBy(e => e.PropertyName)
                .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());

            await context.Response.WriteAsJsonAsync(new Microsoft.AspNetCore.Mvc.ValidationProblemDetails(errors)
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Validation Failed",
                Detail = "One or more validation errors occurred."
            });
        }
        else if (exception is ECommerce.Domain.Exceptions.DomainException domainEx)
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            await context.Response.WriteAsJsonAsync(new Microsoft.AspNetCore.Mvc.ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Domain Rule Violation",
                Detail = domainEx.Message
            });
        }
        else
        {
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            await context.Response.WriteAsJsonAsync(new Microsoft.AspNetCore.Mvc.ProblemDetails
            {
                Status = StatusCodes.Status500InternalServerError,
                Title = "Internal Server Error",
                Detail = exception.Message
            });
        }
    });
});

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

// --- Map API Endpoints ---
app.MapProductEndpoints();
app.MapCustomerEndpoints();
app.MapOrderEndpoints();
app.MapStatsEndpoints();

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

