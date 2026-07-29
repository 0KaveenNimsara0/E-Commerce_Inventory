using ECommerce.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Api.Extensions;

public static class DatabaseInitializer
{
    public static void InitializeDatabase(this WebApplication app)
    {
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
    }
}
