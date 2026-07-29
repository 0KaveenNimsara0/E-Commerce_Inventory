using ECommerce.Application.Services;

namespace ECommerce.Api.Endpoints;

public static class StatsEndpoints
{
    public static void MapStatsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/stats")
            .WithTags("Stats");

        group.MapGet("/", async (IStatsService statsService) =>
        {
            var stats = await statsService.GetSystemStatsAsync();
            return Results.Ok(stats);
        });
    }
}
