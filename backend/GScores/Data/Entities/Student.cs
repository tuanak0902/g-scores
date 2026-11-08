namespace GScores.Data.Entities {
    public class Student {
        public string Sbd { get; set; } = string.Empty;

        public decimal? Math { get; set; }
        public decimal? Literature { get; set; }
        public decimal? ForeignLanguage { get; set; }

        public decimal? Physics { get; set; }
        public decimal? Chemistry { get; set; }
        public decimal? Biology { get; set; }

        public decimal? History { get; set; }
        public decimal? Geography { get; set; }
        public decimal? CivicEducation { get; set; }

        public string? ForeignLanguageCode { get; set; }
    }
}
