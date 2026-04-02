using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HelloWorldApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Carts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Carts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 2000, nullable: false),
                    Price = table.Column<decimal>(type: "decimal(12,2)", nullable: false),
                    Category = table.Column<string>(type: "TEXT", nullable: false),
                    sellerName = table.Column<string>(type: "TEXT", nullable: false),
                    postedDate = table.Column<DateOnly>(type: "TEXT", nullable: false),
                    ImageUrl = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CartItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CartId = table.Column<int>(type: "INTEGER", nullable: false),
                    ProductId = table.Column<int>(type: "INTEGER", nullable: false),
                    Quantity = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CartItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CartItems_Carts_CartId",
                        column: x => x.CartId,
                        principalTable: "Carts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CartItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Category", "Description", "ImageUrl", "Price", "Title", "postedDate", "sellerName" },
                values: new object[,]
                {
                    { 1, "Textbooks", "A comprehensive textbook covering all aspects of organic chemistry, including reaction mechanisms, synthesis, and spectroscopy.", "https://example.com/images/organic-chemistry-textbook.jpg", 19.99m, "Organic Chemistry Textbook", new DateOnly(2026, 4, 1), "Audrey Smith" },
                    { 2, "Clothing", "Official Ohio State University game day jersey featuring the school's colors and logo.", "https://example.com/images/osu-game-day-jersey.jpg", 14.99m, "OSU Game Day Jersey", new DateOnly(2026, 4, 1), "Brian Johnson" },
                    { 3, "Stationery", "A set of 10 mechanical pencils with different lead thicknesses, perfect for students and professionals.", "https://example.com/images/mechanical-pencil-set.jpg", 9.99m, "Mechanical Pencil Set", new DateOnly(2026, 4, 1), "Catherine Lee" },
                    { 4, "Dorm Decor", "A bright and energy-efficient desktop lamp with adjustable brightness.", "https://example.com/images/desktop-lamp.jpg", 29.99m, "Desktop Lamp", new DateOnly(2026, 4, 1), "Alyssa Powell" },
                    { 5, "Dorm Decor", "A set of 10 LED light strips with adjustable brightness and color options.", "https://example.com/images/led-light-strip.jpg", 39.99m, "LED Light Strip", new DateOnly(2026, 4, 1), "David Martinez" },
                    { 6, "Stationery", "A set of 12 highlighters in various colors for marking important text.", "https://example.com/images/highlighter-set.jpg", 12.99m, "Highlighter Set", new DateOnly(2026, 4, 1), "Emily Davis" },
                    { 7, "Clothing", "A comfortable Ohio State University hoodie featuring the school's logo and colors.", "https://example.com/images/osu-hoodie.jpg", 34.99m, "OSU Hoodie", new DateOnly(2026, 4, 1), "Michael Brown" },
                    { 8, "Textbooks", "A comprehensive textbook covering advanced calculus topics for students in Calculus II.", "https://example.com/images/calculus-ii-textbook.jpg", 35.00m, "Calculus II Textbook", new DateOnly(2026, 4, 1), "Sarah Wilson" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_CartItems_CartId",
                table: "CartItems",
                column: "CartId");

            migrationBuilder.CreateIndex(
                name: "IX_CartItems_ProductId",
                table: "CartItems",
                column: "ProductId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CartItems");

            migrationBuilder.DropTable(
                name: "Carts");

            migrationBuilder.DropTable(
                name: "Products");
        }
    }
}
