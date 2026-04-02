using Microsoft.AspNetCore.Mvc;
using HelloWorldApi.Models;

namespace HelloWorldApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary> Gets all products. </summary>
    [HttpGet]
    public IActionResult GetAllProducts()
    {
        var products = _context.Products.ToList();
        return Ok(products);
    }

    /// <summary> Get a single product by its ID.</summary>
    [HttpGet("{id}")]
    public IActionResult GetProduct(int id)
    {
        var product = _context.Products.Find(id);
        if (product == null)
        {
            return NotFound(new { Message = $"Product with ID {id} not found." });
        }

        return Ok(product);
    }
}
    
