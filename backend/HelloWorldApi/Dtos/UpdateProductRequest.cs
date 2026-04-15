namespace HelloWorldApi.Dtos;

public class UpdateProductRequest
{
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required decimal Price { get; set; }
    public required string Category { get; set; }
    public required string SellerName { get; set; }
    public required string ImageUrl { get; set; }
}
