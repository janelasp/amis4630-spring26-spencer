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
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _db;

    public OrdersController(AppDbContext db)
    {
        _db = db;
    }

    // GET /api/orders (kept for backwards compatibility)
    [HttpGet]
    public async Task<ActionResult<List<OrderResponse>>> GetMyOrders()
    {
        return await GetMyOrdersMine();
    }

    // GET /api/orders/mine
    [HttpGet("mine")]
    public async Task<ActionResult<List<OrderResponse>>> GetMyOrdersMine()
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(currentUserId))
        {
            return Unauthorized();
        }

        var orders = await _db.Orders
            .Where(o => o.UserId == currentUserId)
            .OrderByDescending(o => o.CreatedAtUtc)
            .Include(o => o.Items)
            .ThenInclude(i => i.Product)
            .ToListAsync();

        return Ok(orders.Select(MapOrderToResponse).ToList());
    }

    // GET /api/orders/{id}
    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderResponse>> GetOrder(int id)
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(currentUserId))
        {
            return Unauthorized();
        }

        var order = await _db.Orders
            .Include(o => o.Items)
            .ThenInclude(i => i.Product)
            .SingleOrDefaultAsync(o => o.Id == id);

        if (order == null)
        {
            return NotFound();
        }

        if (order.UserId != currentUserId)
        {
            return Forbid();
        }

        return Ok(MapOrderToResponse(order));
    }

    // GET /api/orders/all (admin only)
    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<OrderResponse>>> GetAllOrders()
    {
        var orders = await _db.Orders
            .OrderByDescending(o => o.CreatedAtUtc)
            .Include(o => o.Items)
            .ThenInclude(i => i.Product)
            .ToListAsync();

        return Ok(orders.Select(MapOrderToResponse).ToList());
    }

    // PUT /api/orders/{orderId}/status (admin only)
    [HttpPut("{orderId:int}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<OrderResponse>> UpdateOrderStatus(
        int orderId,
        [FromBody] UpdateOrderStatusRequest request)
    {
        if (request == null)
        {
            return BadRequest(new { Message = "Request body is required." });
        }

        var order = await _db.Orders
            .Include(o => o.Items)
            .ThenInclude(i => i.Product)
            .SingleOrDefaultAsync(o => o.Id == orderId);

        if (order == null)
        {
            return NotFound();
        }

        order.Status = request.Status.Trim();
        await _db.SaveChangesAsync();

        return Ok(MapOrderToResponse(order));
    }

    // POST /api/orders  (creates an order from the current user's cart)
    [HttpPost]
    public async Task<ActionResult<OrderResponse>> CreateOrderFromCart([FromBody] CreateOrderRequest request)
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(currentUserId))
        {
            return Unauthorized();
        }

        if (request == null)
        {
            return BadRequest(new { Message = "Request body is required." });
        }

        var shippingAddress = request.ShippingAddress?.Trim() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(shippingAddress))
        {
            return BadRequest(new { Message = "ShippingAddress is required." });
        }

        var cart = await _db.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .SingleOrDefaultAsync(c => c.UserId == currentUserId);

        if (cart == null || cart.Items.Count == 0)
        {
            return BadRequest(new { Message = "Cart is empty." });
        }

        var nowUtc = DateTime.UtcNow;
        var order = new Order
        {
            UserId = currentUserId,
            OrderDate = nowUtc,
            CreatedAtUtc = nowUtc,
            Status = "Placed",
            ShippingAddress = shippingAddress,
            ConfirmationNumber = GenerateConfirmationNumber(nowUtc),
            Items = cart.Items.Select(ci => new OrderItem
            {
                ProductId = ci.ProductId,
                Quantity = ci.Quantity,
                UnitPrice = ci.Product?.Price ?? 0m
            }).ToList()
        };

        order.Total = order.Items.Sum(i => i.UnitPrice * i.Quantity);

        _db.Orders.Add(order);

        // Clear cart after ordering
        _db.CartItems.RemoveRange(cart.Items);
        cart.Items.Clear();
        cart.UpdatedAt = nowUtc;

        await _db.SaveChangesAsync();

        // Reload with Product for response
        var created = await _db.Orders
            .Include(o => o.Items)
            .ThenInclude(i => i.Product)
            .SingleAsync(o => o.Id == order.Id);

        return CreatedAtAction(nameof(GetOrder), new { id = created.Id }, MapOrderToResponse(created));
    }

    private static string GenerateConfirmationNumber(DateTime nowUtc)
    {
        var datePart = nowUtc.ToString("yyyyMMdd");
        var randomPart = Guid.NewGuid().ToString("N")[..10].ToUpperInvariant();
        return $"BM-{datePart}-{randomPart}";
    }

    private static OrderResponse MapOrderToResponse(Order order)
    {
        return new OrderResponse
        {
            Id = order.Id,
            UserId = order.UserId,
            OrderDate = order.OrderDate,
            Status = order.Status,
            CreatedAtUtc = order.CreatedAtUtc,
            Total = order.Total,
            ShippingAddress = order.ShippingAddress,
            ConfirmationNumber = order.ConfirmationNumber,
            Items = order.Items.Select(i => new OrderItemResponse
            {
                Id = i.Id,
                ProductId = i.ProductId,
                ProductName = i.Product?.Title ?? string.Empty,
                UnitPrice = i.UnitPrice,
                Quantity = i.Quantity,
                LineTotal = i.UnitPrice * i.Quantity
            }).ToList()
        };
    }
}
