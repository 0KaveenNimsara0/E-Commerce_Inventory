using ECommerce.Api.Endpoints;
using ECommerce.Api.Extensions;
using ECommerce.Api.Middlewares;
using ECommerce.Application;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// --- Configuration ---
if (builder.Environment.IsDevelopment())
{
    builder.Configuration.AddUserSecrets<Program>();
}
builder.Configuration.AddEnvironmentVariables();

// --- Services ---
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection");

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "Missing PostgreSQL connection string. " +
        "Set ConnectionStrings__DefaultConnection or ConnectionStrings:DefaultConnection in your environment/user secrets.");
}

builder.Services.AddDbContext<ECommerceDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddScoped<IApplicationDbContext>(provider =>
    provider.GetRequiredService<ECommerceDbContext>());

builder.Services.AddApplicationServices();

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

// --- Middleware Pipeline ---
app.UseMiddleware<GlobalExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowFrontend");

// --- Database Initialization ---
app.InitializeDatabase();

// --- API Endpoints ---
app.MapProductEndpoints();
app.MapCustomerEndpoints();
app.MapOrderEndpoints();
app.MapStatsEndpoints();

app.Run();
