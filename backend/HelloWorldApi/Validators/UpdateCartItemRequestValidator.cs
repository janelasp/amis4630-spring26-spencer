using FluentValidation;
using HelloWorldApi.Dtos;

namespace HelloWorldApi.Validators;

public class UpdateCartItemRequestValidator : AbstractValidator<UpdateCartItemRequest>
{
    public UpdateCartItemRequestValidator()
    {
        RuleFor(x => x.Quantity)
            .InclusiveBetween(1, 99)
            .WithMessage("Quantity must be between 1 and 99.");
    }
}
