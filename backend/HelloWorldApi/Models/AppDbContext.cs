using Microsoft.EntityFrameworkCore;

namespace HelloWorldApi.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products { get; set; } = null!;
    public DbSet<Cart> Carts { get; set; } = null!;
    public DbSet<CartItem> CartItems { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure relationships
        modelBuilder.Entity<Cart>()
            .HasMany(c => c.Items)
            .WithOne(ci => ci.Cart)
            .HasForeignKey(ci => ci.CartId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<CartItem>()
            .HasOne(ci => ci.Product)
            .WithMany()
            .HasForeignKey(ci => ci.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        // Seed product data (moved from ProductsController)
        modelBuilder.Entity<Product>().HasData(
            new Product
            {
                Id = 1,
                Title = "Organic Chemistry Textbook",
                Description = "A comprehensive textbook covering all aspects of organic chemistry, including reaction mechanisms, synthesis, and spectroscopy.",
                Price = 19.99m,
                Category = "Textbooks",
                sellerName = "Audrey Smith",
                postedDate = DateOnly.FromDateTime(DateTime.UtcNow),
                ImageUrl = "https://example.com/images/organic-chemistry-textbook.jpg"
            },
            new Product
            {
                Id = 2,
                Title = "OSU Game Day Jersey",
                Description = "Official Ohio State University game day jersey featuring the school's colors and logo.",
                Price = 14.99m,
                Category = "Clothing",
                sellerName = "Brian Johnson",
                postedDate = DateOnly.FromDateTime(DateTime.UtcNow),
                ImageUrl = "https://example.com/images/osu-game-day-jersey.jpg"
            },
            new Product
            {
                Id = 3,
                Title = "Mechanical Pencil Set",
                Description = "A set of 10 mechanical pencils with different lead thicknesses, perfect for students and professionals.",
                Price = 9.99m,
                Category = "Stationery",
                sellerName = "Catherine Lee",
                postedDate = DateOnly.FromDateTime(DateTime.UtcNow),
                ImageUrl = "https://example.com/images/mechanical-pencil-set.jpg"
            },
            new Product
            {
                Id = 4,
                Title = "Desktop Lamp",
                Description = "A bright and energy-efficient desktop lamp with adjustable brightness.",
                Price = 29.99m,
                Category = "Dorm Decor",
                sellerName = "Alyssa Powell",
                postedDate = DateOnly.FromDateTime(DateTime.UtcNow),
                ImageUrl = "https://example.com/images/desktop-lamp.jpg"
            },
            new Product
            {
                Id = 5,
                Title = "LED Light Strip",
                Description = "A set of 10 LED light strips with adjustable brightness and color options.",
                Price = 39.99m,
                Category = "Dorm Decor",
                sellerName = "David Martinez",
                postedDate = DateOnly.FromDateTime(DateTime.UtcNow),
                ImageUrl = "https://example.com/images/led-light-strip.jpg"
            },
            new Product
            {
                Id = 6,
                Title = "Highlighter Set",
                Description = "A set of 12 highlighters in various colors for marking important text.",
                Price = 12.99m,
                Category = "Stationery",
                sellerName = "Emily Davis",
                postedDate = DateOnly.FromDateTime(DateTime.UtcNow),
                ImageUrl = "https://example.com/images/highlighter-set.jpg"
            },
            new Product
            {
                Id = 7,
                Title = "OSU Hoodie",
                Description = "A comfortable Ohio State University hoodie featuring the school's logo and colors.",
                Price = 34.99m,
                Category = "Clothing",
                sellerName = "Michael Brown",
                postedDate = DateOnly.FromDateTime(DateTime.UtcNow),
                ImageUrl = "https://example.com/images/osu-hoodie.jpg"
            },
            new Product
            {
                Id = 8,
                Title = "Calculus II Textbook",
                Description = "A comprehensive textbook covering advanced calculus topics for students in Calculus II.",
                Price = 35.00m,
                Category = "Textbooks",
                sellerName = "Sarah Wilson",
                postedDate = DateOnly.FromDateTime(DateTime.UtcNow),
                ImageUrl = "https://example.com/images/calculus-ii-textbook.jpg"
            }
        );
    }
}