using HelloWorldApi.Models;

namespace HelloWorldApi.UnitTests;

public class OrderItemTests
{
    [Fact]
    public void LineTotal_MultipliesUnitPriceByQuantity()
    {
        var item = new OrderItem
        {
            OrderId = 1,
            ProductId = 10,
            Quantity = 3,
            UnitPrice = 19.99m
        };

        Assert.Equal(59.97m, item.LineTotal);
    }
}