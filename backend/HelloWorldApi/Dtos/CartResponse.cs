using System.Collections.Generic;

namespace HelloWorldApi.Dtos;

public class CartResponse
{
    public int Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public List<CartItemResponse> Items { get; set; } = new();

    public int TotalItems { get; set; }

    public decimal Subtotal { get; set; }

    public decimal Total { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
