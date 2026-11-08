using GScores.Dtos;
using GScores.Services;
using Microsoft.AspNetCore.Mvc;

namespace GScores.Controllers;

[ApiController]
[Route("api/reports")]
public class ReportsController(ReportService reports) : ControllerBase {
    // GET /api/reports/score-distribution
    [HttpGet("score-distribution")]
    public async Task<ActionResult<IReadOnlyList<SubjectDistributionDto>>> Distribution(CancellationToken ct) =>
        Ok(await reports.GetDistributionAsync(ct));

    // GET /api/reports/top-students   (group A, top 10)
    [HttpGet("top-students")]
    public async Task<ActionResult<IReadOnlyList<TopStudentDto>>> TopStudents(CancellationToken ct) =>
        Ok(await reports.GetTopGroupAAsync(10, ct));
}
