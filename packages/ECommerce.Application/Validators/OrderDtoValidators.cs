using ECommerce.Application.DTOs;
using FluentValidation;

namespace ECommerce.Application.Validators;

public class CreateOrderDtoValidator : AbstractValidator<CreateOrderDto>
{
    public CreateOrderDtoValidator()
    {
        RuleFor(x => x.CustomerId)
            .NotEmpty().WithMessage("Customer ID is required.");

        RuleFor(x => x.Items)
            .NotEmpty().WithMessage("Order must contain at least one item.");

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(i => i.ProductId)
                .NotEmpty().WithMessage("Product ID is required.");
            
            item.RuleFor(i => i.Quantity)
                .GreaterThan(0).WithMessage("Quantity must be greater than zero.");
        });
    }
}

public class UpdateOrderStatusDtoValidator : AbstractValidator<UpdateOrderStatusDto>
{
    public UpdateOrderStatusDtoValidator()
    {
        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status is required.")
            .Must(s => s == "Processing" || s == "Shipped" || s == "Delivered" || s == "Cancelled")
            .WithMessage("Status must be one of: Processing, Shipped, Delivered, Cancelled.");
    }
}
