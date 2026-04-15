using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using HelloWorldApi.Models;
using HelloWorldApi.Services;
using Microsoft.Extensions.Configuration;

namespace HelloWorldApi.UnitTests;

public class TokenServiceTests
{
    [Fact]
    public void CreateRefreshToken_ReturnsBase64Url_NoPadding()
    {
        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "test-key-should-not-be-used-here"
            })
            .Build();

        var tokenService = new TokenService(config);

        var token = tokenService.CreateRefreshToken();

        Assert.False(string.IsNullOrWhiteSpace(token));
        Assert.DoesNotContain('=', token);
        Assert.Matches("^[A-Za-z0-9_-]+$", token);
    }

    [Fact]
    public void CreateAccessToken_IncludesUserIdEmailAndRoleClaims()
    {
        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "THIS_IS_A_TEST_KEY_32+_CHARS_LONG_1234567890",
                ["Jwt:Issuer"] = "BuckeyeMarketplace",
                ["Jwt:Audience"] = "BuckeyeMarketplace",
                ["Jwt:AccessTokenMinutes"] = "1"
            })
            .Build();

        var tokenService = new TokenService(config);
        var user = new ApplicationUser
        {
            Id = "user-123",
            Email = "user@example.com",
            UserName = "user@example.com"
        };

        var before = DateTime.UtcNow;
        var (token, expiresAtUtc) = tokenService.CreateAccessToken(user, new[] { "User" });
        var after = DateTime.UtcNow;

        Assert.False(string.IsNullOrWhiteSpace(token));
        Assert.InRange(expiresAtUtc, before.AddMinutes(1), after.AddMinutes(1));

        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

        Assert.Contains(jwt.Claims, c => c.Type == JwtRegisteredClaimNames.Sub && c.Value == user.Id);
        Assert.Contains(jwt.Claims, c => c.Type == ClaimTypes.NameIdentifier && c.Value == user.Id);
        Assert.Contains(jwt.Claims, c => c.Type == JwtRegisteredClaimNames.Email && c.Value == user.Email);
        Assert.Contains(jwt.Claims, c => c.Type == JwtRegisteredClaimNames.UniqueName && c.Value == user.UserName);
        Assert.Contains(jwt.Claims, c => c.Type == ClaimTypes.Role && c.Value == "User");
    }
}