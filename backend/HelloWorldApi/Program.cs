using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using HelloWorldApi.Models;
using HelloWorldApi.Services;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

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
    if (builder.Environment.IsEnvironment("Testing"))
    {
        options.UseInMemoryDatabase("HelloWorldApi_Testing");
    }
    else
    {
        options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
    }
});

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
    {
        options.User.RequireUniqueEmail = true;

        options.Password.RequiredLength = 8;
        options.Password.RequireDigit = true;
        options.Password.RequireUppercase = true;
        options.Password.RequireLowercase = true;
        options.Password.RequireNonAlphanumeric = false;
    })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException(
        "Missing JWT signing key. Store it in user secrets (not appsettings.json): " +
        "dotnet user-secrets set Jwt:Key \"your-long-random-key\" --project backend/HelloWorldApi");
}

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        var issuer = builder.Configuration["Jwt:Issuer"];
        if (string.IsNullOrWhiteSpace(issuer))
        {
            throw new InvalidOperationException("Missing Jwt:Issuer configuration.");
        }

        var audience = builder.Configuration["Jwt:Audience"];
        if (string.IsNullOrWhiteSpace(audience))
        {
            throw new InvalidOperationException("Missing Jwt:Audience configuration.");
        }

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),

            ValidateIssuer = true,
            ValidIssuer = issuer,

            ValidateAudience = true,
            ValidAudience = audience,

            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1),

            // Keep claim types stable for downstream code
            NameClaimType = ClaimTypes.NameIdentifier,
            RoleClaimType = ClaimTypes.Role,

            // Optional hardening: only accept HS256
            ValidAlgorithms = new[] { SecurityAlgorithms.HmacSha256 }
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddFluentValidationAutoValidation();

var app = builder.Build();

// Seed initial data for the database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    if (context.Database.IsRelational())
    {
        await context.Database.MigrateAsync();
    }
    else
    {
        await context.Database.EnsureCreatedAsync();
    }

    // Dev/testing-only seed data (avoid default credentials in non-dev environments)
    if (app.Environment.IsDevelopment() || app.Environment.IsEnvironment("Testing"))
    {
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        const string adminRoleName = "Admin";
        const string userRoleName = "User";
        const string adminEmail = "admin@buckeye.local";

        if (!await roleManager.RoleExistsAsync(adminRoleName))
        {
            await roleManager.CreateAsync(new IdentityRole(adminRoleName));
        }

        if (!await roleManager.RoleExistsAsync(userRoleName))
        {
            await roleManager.CreateAsync(new IdentityRole(userRoleName));
        }

        var adminUser = await userManager.FindByEmailAsync(adminEmail);
        if (adminUser == null)
        {
            var adminPassword = builder.Configuration["Seed:AdminPassword"];
            if (string.IsNullOrWhiteSpace(adminPassword))
            {
                adminPassword = "Admin1234";
            }

            adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true
            };

            var createResult = await userManager.CreateAsync(adminUser, adminPassword);
            if (!createResult.Succeeded)
            {
                var errors = string.Join("; ", createResult.Errors.Select(e => e.Description));
                throw new InvalidOperationException($"Failed to seed admin user: {errors}");
            }
        }

        if (!await userManager.IsInRoleAsync(adminUser, adminRoleName))
        {
            await userManager.AddToRoleAsync(adminUser, adminRoleName);
        }

        if (!await userManager.IsInRoleAsync(adminUser, userRoleName))
        {
            await userManager.AddToRoleAsync(adminUser, userRoleName);
        }

        // Seed a regular user (User role only) for dev/grading convenience.
        const string userEmail = "user@buckeye.local";

        var regularUser = await userManager.FindByEmailAsync(userEmail);
        if (regularUser == null)
        {
            var userPassword = builder.Configuration["Seed:UserPassword"];
            if (string.IsNullOrWhiteSpace(userPassword))
            {
                userPassword = "User1234";
            }

            regularUser = new ApplicationUser
            {
                UserName = userEmail,
                Email = userEmail,
                EmailConfirmed = true
            };

            var createResult = await userManager.CreateAsync(regularUser, userPassword);
            if (!createResult.Succeeded)
            {
                var errors = string.Join("; ", createResult.Errors.Select(e => e.Description));
                throw new InvalidOperationException($"Failed to seed regular user: {errors}");
            }
        }

        if (!await userManager.IsInRoleAsync(regularUser, userRoleName))
        {
            await userManager.AddToRoleAsync(regularUser, userRoleName);
        }

        if (await userManager.IsInRoleAsync(regularUser, adminRoleName))
        {
            await userManager.RemoveFromRoleAsync(regularUser, adminRoleName);
        }

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

            await context.SaveChangesAsync();
        }
    }
}

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.Use(async (context, next) =>
{
    // Basic secure headers (API-safe)
    context.Response.Headers.TryAdd("X-Content-Type-Options", "nosniff");
    context.Response.Headers.TryAdd("X-Frame-Options", "DENY");
    context.Response.Headers.TryAdd("Referrer-Policy", "no-referrer");
    context.Response.Headers.TryAdd("Permissions-Policy", "geolocation=(), microphone=(), camera=()");

    await next();
});

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "v1");
    });
}

app.UseHttpsRedirection();

app.UseRouting();
app.UseCors("AllowReact");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

public partial class Program { }
