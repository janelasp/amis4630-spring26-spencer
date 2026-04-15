using HelloWorldApi.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HelloWorldApi.Models;
using Microsoft.EntityFrameworkCore;

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
    public async Task<ActionResult<List<Product>>> GetAllProducts()
    {
        var products = await _context.Products.ToListAsync();
        return Ok(products);
    }

    /// <summary> Get a single product by its ID.</summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound(new { Message = $"Product with ID {id} not found." });
        }

        return Ok(product);
    }

    // POST /api/products (admin only)
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Product>> CreateProduct([FromBody] CreateProductRequest request)
    {
        if (request == null)
        {
            return BadRequest(new { Message = "Request body is required." });
        }

        var product = new Product
        {
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            Price = request.Price,
            Category = request.Category.Trim(),
            sellerName = request.SellerName.Trim(),
            postedDate = DateOnly.FromDateTime(DateTime.UtcNow),
            ImageUrl = request.ImageUrl.Trim()
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
    }

    // PUT /api/products/{id} (admin only)
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Product>> UpdateProduct(int id, [FromBody] UpdateProductRequest request)
    {
        if (request == null)
        {
            return BadRequest(new { Message = "Request body is required." });
        }

        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound(new { Message = $"Product with ID {id} not found." });
        }

        product.Title = request.Title.Trim();
        product.Description = request.Description.Trim();
        product.Price = request.Price;
        product.Category = request.Category.Trim();
        product.sellerName = request.SellerName.Trim();
        product.ImageUrl = request.ImageUrl.Trim();

        await _context.SaveChangesAsync();

        return Ok(product);
    }

    // DELETE /api/products/{id} (admin only)
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound(new { Message = $"Product with ID {id} not found." });
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

