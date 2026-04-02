using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelloWorldApi.Models;

/// <summary>
/// Represents a product in the system with properties such as Id, Title, Description, Price, Category, SellerName, PostedDate, and ImageUrl.
/// </summary>
public class Product
{
    public int Id { get; set; }
    
    [Required, MaxLength(200)]
    public required string Title { get; set; }

    [MaxLength(2000)]
    public required string Description { get; set; }
    
    [Column(TypeName = "decimal(12,2)")]
    public required decimal Price { get; set; }

    public required string Category { get; set; }

    public required string sellerName { get; set; }

    public DateOnly postedDate { get; set; }

    public required string ImageUrl { get; set; }    


}