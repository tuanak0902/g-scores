namespace GScores.Validation;

public static class SbdValidator
{
    public const int Length = 8;

    /// <summary>Registration number: exactly 8 digits (leading zeros allowed).</summary>
    public static bool IsValid(string? sbd) =>
        sbd is not null && sbd.Length == Length && sbd.All(char.IsAsciiDigit);
}
