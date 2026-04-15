using HelloWorldApi.Dtos;
using HelloWorldApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HelloWorldApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "User,Admin")]
public class CartController : ControllerBase
{
    private readonly AppDbContext _context;

    public CartController(AppDbContext context)
    {
        _context = context;
    }

    // Endpoint 1: GET /api/cart
    [HttpGet]
    public async Task<ActionResult<CartResponse>> GetCart()
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(currentUserId))
        {
            return Unauthorized();
        }

        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .SingleOrDefaultAsync(c => c.UserId == currentUserId);

        if (cart == null)
        {
            return NotFound();
        }

        var response = MapCartToResponse(cart);
        return Ok(response);
    }

    // Endpoint 2: POST /api/cart
    [HttpPost]
    public async Task<ActionResult<CartItemResponse>> AddToCart([FromBody] AddToCartRequest request)
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(currentUserId))
        {
            return Unauthorized();
        }

        var product = await _context.Products.FindAsync(request.ProductId);
        if (product == null)
        {
            return NotFound(new { Message = $"Product with ID {request.ProductId} not found." });
        }

        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .SingleOrDefaultAsync(c => c.UserId == currentUserId);

        if (cart == null)
        {
            cart = new Cart
            {
                UserId = currentUserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Items = new List<CartItem>()
            };

            _context.Carts.Add(cart);
        }

        var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == request.ProductId);

        if (existingItem != null)
        {
            existingItem.Quantity += request.Quantity;
        }
        else
        {
            var newItem = new CartItem
            {
                Cart = cart,
                Product = product,
                ProductId = product.Id,
                Quantity = request.Quantity
            };

            cart.Items.Add(newItem);
        }

        cart.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        // reload the updated/created item with product to map cleanly
        var cartItem = cart.Items.First(i => i.ProductId == request.ProductId);
        var itemResponse = MapCartItemToResponse(cartItem);

        return CreatedAtAction(nameof(GetCart), null, itemResponse);
    }

    // Endpoint 3: PUT /api/cart/{cartItemId}
    [HttpPut("{cartItemId}")]
    public async Task<ActionResult<CartItemResponse>> UpdateCartItem(int cartItemId, [FromBody] UpdateCartItemRequest request)
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(currentUserId))
        {
            return Unauthorized();
        }

        var cartItem = await _context.CartItems
            .Include(i => i.Cart)
            .Include(i => i.Product)
            .SingleOrDefaultAsync(i => i.Id == cartItemId);

        if (cartItem == null)
        {
            return NotFound();
        }

        if (cartItem.Cart == null || cartItem.Cart.UserId != currentUserId)
        {
            return Forbid();
        }

        cartItem.Quantity = request.Quantity;
        cartItem.Cart.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var response = MapCartItemToResponse(cartItem);
        return Ok(response);
    }

    // Endpoint 4: DELETE /api/cart/{cartItemId}
    [HttpDelete("{cartItemId}")]
    public async Task<IActionResult> DeleteCartItem(int cartItemId)
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(currentUserId))
        {
            return Unauthorized();
        }

        var cartItem = await _context.CartItems
            .Include(i => i.Cart)
            .SingleOrDefaultAsync(i => i.Id == cartItemId);

        if (cartItem == null)
        {
            return NotFound();
        }

        if (cartItem.Cart == null || cartItem.Cart.UserId != currentUserId)
        {
            return Forbid();
        }

        cartItem.Cart.UpdatedAt = DateTime.UtcNow;
        _context.CartItems.Remove(cartItem);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // Endpoint 5: DELETE /api/cart/clear
    [HttpDelete("clear")]
    public async Task<IActionResult> ClearCart()
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(currentUserId))
        {
            return Unauthorized();
        }

        var cart = await _context.Carts
            .Include(c => c.Items)
            .SingleOrDefaultAsync(c => c.UserId == currentUserId);

        if (cart == null)
        {
            return NotFound();
        }

        if (cart.Items.Any())
        {
            _context.CartItems.RemoveRange(cart.Items);
            cart.Items.Clear();
            cart.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }

        return NoContent();
    }

    private static CartResponse MapCartToResponse(Cart cart)
    {
        var items = cart.Items.Select(MapCartItemToResponse).ToList();

        var subtotal = items.Sum(i => i.LineTotal);
        var totalItems = items.Sum(i => i.Quantity);

        return new CartResponse
        {
            Id = cart.Id,
            UserId = cart.UserId,
            Items = items,
            TotalItems = totalItems,
            Subtotal = subtotal,
            Total = subtotal, // no tax/shipping yet
            CreatedAt = cart.CreatedAt,
            UpdatedAt = cart.UpdatedAt
        };
    }

    private static CartItemResponse MapCartItemToResponse(CartItem item)
    {
        var price = item.Product?.Price ?? 0m;
        var lineTotal = price * item.Quantity;

        return new CartItemResponse
        {
            Id = item.Id,
            ProductId = item.ProductId,
            ProductName = item.Product?.Title ?? string.Empty,
            Price = price,
            ImageUrl = item.Product?.ImageUrl,
            Quantity = item.Quantity,
            LineTotal = lineTotal
        };
    }
}


