using HelloWorldApi.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace HelloWorldApi.IntegrationTests;

public sealed class TestWebApplicationFactory : WebApplicationFactory<Program>
{
    private static bool _envConfigured;
    private static readonly object _envLock = new();

    public TestWebApplicationFactory()
    {
        lock (_envLock)
        {
            if (_envConfigured)
            {
                return;
            }

            Environment.SetEnvironmentVariable("ASPNETCORE_ENVIRONMENT", "Testing");
            Environment.SetEnvironmentVariable("Jwt__Key", "THIS_IS_A_TEST_KEY_32+_CHARS_LONG_1234567890");
            Environment.SetEnvironmentVariable("Jwt__Issuer", "BuckeyeMarketplace");
            Environment.SetEnvironmentVariable("Jwt__Audience", "BuckeyeMarketplace");
            Environment.SetEnvironmentVariable("Jwt__AccessTokenMinutes", "60");
            Environment.SetEnvironmentVariable("Jwt__RefreshTokenDays", "7");

            _envConfigured = true;
        }
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureAppConfiguration((_, config) =>
        {
            config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "THIS_IS_A_TEST_KEY_32+_CHARS_LONG_1234567890",
                ["Jwt:Issuer"] = "BuckeyeMarketplace",
                ["Jwt:Audience"] = "BuckeyeMarketplace",
                ["Jwt:AccessTokenMinutes"] = "60",
                ["Jwt:RefreshTokenDays"] = "7"
            });
        });

        builder.ConfigureServices(services =>
        {
            services.RemoveAll<DbContextOptions<AppDbContext>>();

            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseInMemoryDatabase($"HelloWorldApi_TestDb_{Guid.NewGuid():N}");
            });
        });
    }
}