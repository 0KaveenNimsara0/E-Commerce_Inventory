using ECommerce.Application.Common.Interfaces;
using ECommerce.Domain.Entities;
using ECommerce.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Persistence;

public class ECommerceDbContext : DbContext, IApplicationDbContext
{
    public ECommerceDbContext(DbContextOptions<ECommerceDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<Customer> Customers => Set<Customer>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Product Configuration
        modelBuilder.Entity<Product>(builder =>
        {
            builder.HasKey(p => p.Id);
            builder.OwnsOne(p => p.Price, money =>
            {
                money.Property(m => m.Amount).HasColumnName("PriceAmount").HasPrecision(18, 2);
                money.Property(m => m.Currency).HasColumnName("PriceCurrency").HasMaxLength(3);
            });
        });

        // Order Configuration
        modelBuilder.Entity<Order>(builder =>
        {
            builder.HasKey(o => o.Id);
            builder.Navigation(o => o.Items).AutoInclude();
            builder.OwnsMany(o => o.Items, item =>
            {
                item.WithOwner().HasForeignKey("OrderId");
                item.HasKey(i => i.Id);
                item.OwnsOne(i => i.UnitPrice, money =>
                {
                    money.Property(m => m.Amount).HasColumnName("UnitPriceAmount").HasPrecision(18, 2);
                    money.Property(m => m.Currency).HasColumnName("UnitPriceCurrency").HasMaxLength(3);
                });
            });
        });

        // Customer Configuration
        modelBuilder.Entity<Customer>(builder =>
        {
            builder.HasKey(c => c.Id);
        });
    }

}
