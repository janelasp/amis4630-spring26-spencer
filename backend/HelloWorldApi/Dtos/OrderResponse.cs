namespace HelloWorldApi.Dtos;

public class OrderResponse
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
    public decimal Total { get; set; }
    public string ShippingAddress { get; set; } = string.Empty;
    public string ConfirmationNumber { get; set; } = string.Empty;
    public List<OrderItemResponse> Items { get; set; } = new();
}
