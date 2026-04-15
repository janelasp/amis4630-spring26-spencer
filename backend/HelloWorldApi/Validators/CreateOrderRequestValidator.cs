using FluentValidation;
using HelloWorldApi.Dtos;

namespace HelloWorldApi.Validators;

public class CreateOrderRequestValidator : AbstractValidator<CreateOrderRequest>
{
    public CreateOrderRequestValidator()
    {
        RuleFor(x => x.ShippingAddress)
            .NotEmpty()
            .MinimumLength(5);
    }
}
