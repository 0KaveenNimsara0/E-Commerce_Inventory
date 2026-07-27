var builder = WebApplication.CreateBuilder(args);

// Ensure User Secrets are loaded in Development environment
if (builder.Environment.IsDevelopment())
{
    builder.Configuration.AddUserSecrets<Program>();
}

// Add services to the container.
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Example endpoint showing how secrets & configs are retrieved securely
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
