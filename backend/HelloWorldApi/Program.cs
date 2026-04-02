using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using HelloWorldApi.Models;
using FluentValidation;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddSwaggerGen();

//Add Swagger portal services
builder.Services.AddEndpointsApiExplorer();

//Configure CORS to allow React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy => policy.WithOrigins("http://localhost:5173")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddValidatorsFromAssemblyContaining<Program>();

var app = builder.Build();

// Seed initial data for the in-memory database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    if (!context.Products.Any())
    {
        context.Products.AddRange(
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

        context.SaveChanges();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    // ⭐ ADD THESE LINEs
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "v1");
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowReact");  // ⭐ ADD THIS LINE
app.UseAuthorization();

app.MapControllers();

app.Run();
