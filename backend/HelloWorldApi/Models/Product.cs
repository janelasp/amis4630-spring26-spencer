namespace HelloWorldApi.Models;

/// <summary>
/// Represents a product in the system with properties such as Id, Title, Description, Price, Category, SellerName, PostedDate, and ImageUrl.
/// </summary>
public class Product
{
    public int Id { get; set; }
    public required string Title { get; set; }

    public required string Description { get; set; }
    
    public required decimal Price { get; set; }

    public required string Category { get; set; }

    public required string sellerName { get; set; }

    public DateOnly postedDate { get; set; }

    public required string ImageUrl { get; set; }    


}