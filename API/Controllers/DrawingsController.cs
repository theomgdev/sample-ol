using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DrawingsController : ControllerBase
{
    private readonly ILogger<DrawingsController> _logger;

    // Constructor
    public DrawingsController(ILogger<DrawingsController> logger)
    {
        _logger = logger;
    }

    // GET: api/Drawings/getall
    [HttpGet("getall")]
    public IActionResult GetAll()
    {
        return Ok();
    }

    // GET: api/Drawings/getbyid/5
    [HttpGet("getbyid/{id}")]
    public IActionResult GetById(int id)
    {
        return Ok();
    }

    // POST: api/Drawings/create
    [HttpPost("create")]
    public IActionResult Create(Drawing drawing)
    {
        return Ok();
    }

    // PUT: api/Drawings/update
    [HttpPut("update")]
    public IActionResult Update(Drawing drawing)
    {
        return Ok();
    }

    // DELETE: api/Drawings/delete/5
    [HttpDelete("delete/{id}")]
    public IActionResult Delete(int id)
    {
        return Ok();
    }

    // GET: api/Drawings/getcoordinates/5
    [HttpGet("getcoordinates/{id}")]
    public IActionResult GetCoordinates(int id)
    {
        return Ok();
    }
}
