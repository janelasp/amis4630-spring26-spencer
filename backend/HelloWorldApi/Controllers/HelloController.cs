using Microsoft.AspNetCore.Mvc;

namespace HelloWorldApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HelloController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetHello()
        {
            return Ok(new
            {
                message = "Hello from .NET! 🎉",
                timestamp = DateTime.UtcNow
            });
        }
    }
}