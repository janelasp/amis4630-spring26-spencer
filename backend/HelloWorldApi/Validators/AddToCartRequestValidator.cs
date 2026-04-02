using FluentValidation;
using HelloWorldApi.Dtos;

namespace HelloWorldApi.Validators;

public class AddToCartRequestValidator : AbstractValidator<AddToCartRequest>
{
    public AddToCartRequestValidator()
    {
        RuleFor(x => x.ProductId)
            .GreaterThan(0)
            .WithMessage("ProductId must be greater than 0.");

        RuleFor(x => x.Quantity)
            .InclusiveBetween(1, 99)
            .WithMessage("Quantity must be between 1 and 99.");
    }
}
