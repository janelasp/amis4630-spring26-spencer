using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using HelloWorldApi.Dtos;
using Microsoft.AspNetCore.Mvc.Testing;

namespace HelloWorldApi.IntegrationTests;

public class AdminAuthorizationTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly WebApplicationFactory<Program> _factory;

    public AdminAuthorizationTests(TestWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetUsers_WhenAuthenticatedButNotAdmin_ReturnsForbidden()
    {
        using var client = _factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });

        client.BaseAddress = new Uri("https://localhost");

        var registerResponse = await client.PostAsJsonAsync("/api/auth/register", new RegisterRequest
        {
            Email = $"user-{Guid.NewGuid():N}@example.com",
            Password = "Password1"
        });

        Assert.Equal(HttpStatusCode.Created, registerResponse.StatusCode);

        var auth = await registerResponse.Content.ReadFromJsonAsync<AuthResponse>();
        Assert.NotNull(auth);
        Assert.False(string.IsNullOrWhiteSpace(auth.AccessToken));

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth.AccessToken);

        var adminResponse = await client.GetAsync("/api/admin/users");

        Assert.Equal(HttpStatusCode.Forbidden, adminResponse.StatusCode);
    }
}
