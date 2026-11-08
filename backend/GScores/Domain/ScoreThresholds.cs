namespace GScores.Domain;

public enum ScoreLevel { Excellent, Good, Average, Poor }

/// <summary>Single place that defines the 4 report levels.</summary>
public static class ScoreThresholds
{
    public const decimal Excellent = 8m; // >= 8
    public const decimal Good = 6m;      // 6 <= x < 8
    public const decimal Average = 4m;   // 4 <= x < 6  (below 4 = Poor)

    public static ScoreLevel Classify(decimal score) =>
        score >= Excellent ? ScoreLevel.Excellent :
        score >= Good ? ScoreLevel.Good :
        score >= Average ? ScoreLevel.Average :
        ScoreLevel.Poor;
}
