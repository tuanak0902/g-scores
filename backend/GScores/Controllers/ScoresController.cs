using GScores.Data;
using GScores.Data.Entities;
using GScores.Validation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GScores.Controllers;

[ApiController]
[Route("api/scores")]
public class ScoresController(AppDbContext db) : ControllerBase {
    // GET /api/scores/01000001
    [HttpGet("{sbd}")]
    public async Task<ActionResult<Student>> Get(string sbd, CancellationToken ct) {
        sbd = sbd.Trim();
        if (!SbdValidator.IsValid(sbd))
            return Problem("Registration number must be exactly 8 digits.", statusCode: 400);

        var student = await db.Students.AsNoTracking().FirstOrDefaultAsync(s => s.Sbd == sbd, ct);

        return student is null
            ? Problem($"No student found with registration number {sbd}.", statusCode: 404)
            : Ok(student);
    }
}
