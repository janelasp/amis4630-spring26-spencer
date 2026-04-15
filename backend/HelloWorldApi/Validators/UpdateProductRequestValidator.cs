using FluentValidation;
using HelloWorldApi.Dtos;

namespace HelloWorldApi.Validators;

public class UpdateProductRequestValidator : AbstractValidator<UpdateProductRequest>
{
    public UpdateProductRequestValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Description).NotEmpty().MaximumLength(2000);
        RuleFor(x => x.Price).GreaterThanOrEqualTo(0m);
        RuleFor(x => x.Category).NotEmpty();
        RuleFor(x => x.SellerName).NotEmpty();
        RuleFor(x => x.ImageUrl).NotEmpty();
    }
}
