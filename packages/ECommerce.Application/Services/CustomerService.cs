using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Application.Services;

public interface ICustomerService
{
    Task<IEnumerable<CustomerDto>> GetAllCustomersAsync(CancellationToken cancellationToken = default);
    Task<CustomerDto?> GetCustomerByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<CustomerDto> CreateCustomerAsync(CreateCustomerDto dto, CancellationToken cancellationToken = default);
    Task<CustomerDto?> UpdateCustomerAsync(Guid id, UpdateCustomerDto dto, CancellationToken cancellationToken = default);
}

public class CustomerService : ICustomerService
{
    private readonly IApplicationDbContext _db;
    private readonly IValidator<CreateCustomerDto> _createValidator;
    private readonly IValidator<UpdateCustomerDto> _updateValidator;

    public CustomerService(
        IApplicationDbContext db,
        IValidator<CreateCustomerDto> createValidator,
        IValidator<UpdateCustomerDto> updateValidator)
    {
        _db = db;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    public async Task<IEnumerable<CustomerDto>> GetAllCustomersAsync(CancellationToken cancellationToken = default)
    {
        var customers = await _db.Customers.AsNoTracking().ToListAsync(cancellationToken);
        return customers.Select(MapToDto);
    }

    public async Task<CustomerDto?> GetCustomerByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var customer = await _db.Customers.FindAsync(new object[] { id }, cancellationToken);
        return customer == null ? null : MapToDto(customer);
    }

    public async Task<CustomerDto> CreateCustomerAsync(CreateCustomerDto dto, CancellationToken cancellationToken = default)
    {
        await _createValidator.ValidateAndThrowAsync(dto, cancellationToken);

        var customer = new Customer(dto.FirstName, dto.LastName, dto.Email, dto.IsActive);
        _db.Customers.Add(customer);
        await _db.SaveChangesAsync(cancellationToken);
        return MapToDto(customer);
    }

    public async Task<CustomerDto?> UpdateCustomerAsync(Guid id, UpdateCustomerDto dto, CancellationToken cancellationToken = default)
    {
        await _updateValidator.ValidateAndThrowAsync(dto, cancellationToken);

        var customer = await _db.Customers.FindAsync(new object[] { id }, cancellationToken);
        if (customer == null) return null;

        customer.UpdateDetails(dto.FirstName, dto.LastName, dto.Email);

        if (dto.IsActive && !customer.IsActive)
        {
            customer.Activate();
        }
        else if (!dto.IsActive && customer.IsActive)
        {
            customer.Deactivate();
        }

        await _db.SaveChangesAsync(cancellationToken);
        return MapToDto(customer);
    }

    private static CustomerDto MapToDto(Customer c) => new(
        c.Id,
        c.FirstName,
        c.LastName,
        c.FullName,
        c.Email,
        c.IsActive
    );
}
