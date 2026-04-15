using FluentValidation.Results;
using HelloWorldApi.Dtos;
using HelloWorldApi.Validators;

namespace HelloWorldApi.UnitTests;

public class RegisterRequestValidatorTests
{
    [Fact]
    public void Validate_WhenEmailMissing_IsInvalid()
    {
        var validator = new RegisterRequestValidator();
        var request = new RegisterRequest
        {
            Email = "",
            Password = "Password1"
        };

        ValidationResult result = validator.Validate(request);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == nameof(RegisterRequest.Email));
    }

    [Fact]
    public void Validate_WhenPasswordMissingUppercase_IsInvalidWithExpectedMessage()
    {
        var validator = new RegisterRequestValidator();
        var request = new RegisterRequest
        {
            Email = "user@example.com",
            Password = "password1"
        };

        ValidationResult result = validator.Validate(request);

        Assert.False(result.IsValid);
        Assert.Contains(
            result.Errors,
            e => e.PropertyName == nameof(RegisterRequest.Password)
                 && e.ErrorMessage.Contains("uppercase", StringComparison.OrdinalIgnoreCase));
    }

    [Fact]
    public void Validate_WhenPasswordMissingDigit_IsInvalidWithExpectedMessage()
    {
        var validator = new RegisterRequestValidator();
        var request = new RegisterRequest
        {
            Email = "user@example.com",
            Password = "Password"
        };

        ValidationResult result = validator.Validate(request);

        Assert.False(result.IsValid);
        Assert.Contains(
            result.Errors,
            e => e.PropertyName == nameof(RegisterRequest.Password)
                 && e.ErrorMessage.Contains("digit", StringComparison.OrdinalIgnoreCase));
    }
}
