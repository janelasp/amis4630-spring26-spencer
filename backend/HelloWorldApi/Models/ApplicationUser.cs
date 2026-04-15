using Microsoft.AspNetCore.Identity;

namespace HelloWorldApi.Models;

public class ApplicationUser : IdentityUser
{
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}
