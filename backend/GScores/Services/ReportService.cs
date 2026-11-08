using GScores.Data;
using GScores.Domain;
using GScores.Dtos;
using Microsoft.EntityFrameworkCore;

namespace GScores.Services;

public class ReportService(AppDbContext db)
{
    /// <summary>Per subject: number of students in each of the 4 levels.</summary>
    public async Task<IReadOnlyList<SubjectDistributionDto>> GetDistributionAsync(CancellationToken ct)
    {
        var result = new List<SubjectDistributionDto>();

        // Sequential on purpose: a DbContext can't run parallel queries.
        foreach (var subject in Subjects.All)
        {
            var prop = subject.PropertyName; // from our own classes, never user input

            var counts = await db.Students.AsNoTracking()
                .Where(s => EF.Property<decimal?>(s, prop) != null)
                .GroupBy(_ => 1)
                .Select(g => new
                {
                    Excellent = g.Count(s => EF.Property<decimal?>(s, prop) >= ScoreThresholds.Excellent),
                    Good = g.Count(s => EF.Property<decimal?>(s, prop) >= ScoreThresholds.Good
                                     && EF.Property<decimal?>(s, prop) < ScoreThresholds.Excellent),
                    Average = g.Count(s => EF.Property<decimal?>(s, prop) >= ScoreThresholds.Average
                                        && EF.Property<decimal?>(s, prop) < ScoreThresholds.Good),
                    Poor = g.Count(s => EF.Property<decimal?>(s, prop) < ScoreThresholds.Average)
                })
                .FirstOrDefaultAsync(ct);

            result.Add(new SubjectDistributionDto(
                subject.Code, subject.DisplayName,
                counts?.Excellent ?? 0, counts?.Good ?? 0, counts?.Average ?? 0, counts?.Poor ?? 0));
        }

        return result;
    }

    /// <summary>Top students of group A (math + physics + chemistry).</summary>
    public async Task<IReadOnlyList<TopStudentDto>> GetTopGroupAAsync(int limit, CancellationToken ct)
    {
        var rows = await db.Students.AsNoTracking()
            .Where(s => s.Math != null && s.Physics != null && s.Chemistry != null)
            .OrderByDescending(s => s.Math + s.Physics + s.Chemistry)
            .ThenBy(s => s.Sbd) // stable order for ties
            .Take(limit)
            .Select(s => new { s.Sbd, Math = s.Math!.Value, Physics = s.Physics!.Value, Chemistry = s.Chemistry!.Value })
            .ToListAsync(ct);

        return rows
            .Select(r => new TopStudentDto(r.Sbd, r.Math, r.Physics, r.Chemistry, r.Math + r.Physics + r.Chemistry))
            .ToList();
    }
}
