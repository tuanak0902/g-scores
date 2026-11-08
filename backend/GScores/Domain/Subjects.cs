namespace GScores.Domain;

/// <summary>The nine subjects, in report order. No DI registration needed.</summary>
public static class Subjects
{
    public static readonly IReadOnlyList<Subject> All = new Subject[]
    {
        new MathSubject(),
        new LiteratureSubject(),
        new ForeignLanguageSubject(),
        new PhysicsSubject(),
        new ChemistrySubject(),
        new BiologySubject(),
        new HistorySubject(),
        new GeographySubject(),
        new CivicEducationSubject()
    };
}
