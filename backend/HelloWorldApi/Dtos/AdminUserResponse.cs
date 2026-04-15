namespace HelloWorldApi.Dtos;

public class AdminUserResponse
{
    public required string Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public List<string> Roles { get; set; } = new();
}
