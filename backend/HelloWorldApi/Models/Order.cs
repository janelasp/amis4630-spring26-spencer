using System.ComponentModel.DataAnnotations;

namespace HelloWorldApi.Models;

public class Order
{
    public int Id { get; set; }

    [Required]
    public required string UserId { get; set; }

    public ApplicationUser? User { get; set; }

    public DateTime OrderDate { get; set; } = DateTime.UtcNow;

    [Required]
    public required string Status { get; set; }

    [Required]
    public required string ShippingAddress { get; set; }

    [Required]
    public required string ConfirmationNumber { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();

    public decimal Total { get; set; }
}
