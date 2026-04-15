namespace HelloWorldApi.Dtos;

public class AuthResponse
{
    public required string AccessToken { get; set; }
    public required string RefreshToken { get; set; }
    public DateTime ExpiresAtUtc { get; set; }
}
