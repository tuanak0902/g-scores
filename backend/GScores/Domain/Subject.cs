using GScores.Data.Entities;

namespace GScores.Domain;

/// <summary>Base class for every exam subject (OOP requirement).</summary>
public abstract class Subject
{
    protected Subject(string code, string displayName, string propertyName)
    {
        Code = code;
        DisplayName = displayName;
        PropertyName = propertyName;
    }

    public string Code { get; }          // CSV column, e.g. "toan"
    public string DisplayName { get; }   // e.g. "Math"
    public string PropertyName { get; }  // C# property on Student, used by EF.Property

    public abstract decimal? GetScore(Student student);

    public ScoreLevel Classify(decimal score) => ScoreThresholds.Classify(score);
}

public sealed class MathSubject() : Subject("toan", "Math", nameof(Student.Math))
{
    public override decimal? GetScore(Student s) => s.Math;
}

public sealed class LiteratureSubject() : Subject("ngu_van", "Literature", nameof(Student.Literature))
{
    public override decimal? GetScore(Student s) => s.Literature;
}

public sealed class ForeignLanguageSubject() : Subject("ngoai_ngu", "Foreign Language", nameof(Student.ForeignLanguage))
{
    public override decimal? GetScore(Student s) => s.ForeignLanguage;
}

public sealed class PhysicsSubject() : Subject("vat_li", "Physics", nameof(Student.Physics))
{
    public override decimal? GetScore(Student s) => s.Physics;
}

public sealed class ChemistrySubject() : Subject("hoa_hoc", "Chemistry", nameof(Student.Chemistry))
{
    public override decimal? GetScore(Student s) => s.Chemistry;
}

public sealed class BiologySubject() : Subject("sinh_hoc", "Biology", nameof(Student.Biology))
{
    public override decimal? GetScore(Student s) => s.Biology;
}

public sealed class HistorySubject() : Subject("lich_su", "History", nameof(Student.History))
{
    public override decimal? GetScore(Student s) => s.History;
}

public sealed class GeographySubject() : Subject("dia_li", "Geography", nameof(Student.Geography))
{
    public override decimal? GetScore(Student s) => s.Geography;
}

public sealed class CivicEducationSubject() : Subject("gdcd", "Civic Education", nameof(Student.CivicEducation))
{
    public override decimal? GetScore(Student s) => s.CivicEducation;
}
