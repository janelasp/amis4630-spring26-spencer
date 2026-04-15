using System.ComponentModel.DataAnnotations;

namespace HelloWorldApi.Models;

public class RefreshToken
{
    public int Id { get; set; }

    [Required]
    public required string Token { get; set; }

    [Required]
    public required string UserId { get; set; }

    public ApplicationUser? User { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public DateTime ExpiresAtUtc { get; set; }

    public DateTime? RevokedAtUtc { get; set; }

    public bool IsActive => RevokedAtUtc == null && DateTime.UtcNow < ExpiresAtUtc;
}
