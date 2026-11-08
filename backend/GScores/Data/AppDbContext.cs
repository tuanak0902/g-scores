
using GScores.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace GScores.Data;

public class AppDbContext : DbContext {
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) {
    }

    public DbSet<Student> Students => Set<Student>();

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        base.OnModelCreating(modelBuilder);

        var student = modelBuilder.Entity<Student>();

        student.ToTable("students", table => {
            table.HasCheckConstraint(
                "ck_students_toan",
                "\"toan\" IS NULL OR \"toan\" BETWEEN 0 AND 10");

            table.HasCheckConstraint(
                "ck_students_ngu_van",
                "\"ngu_van\" IS NULL OR \"ngu_van\" BETWEEN 0 AND 10");

            table.HasCheckConstraint(
                "ck_students_ngoai_ngu",
                "\"ngoai_ngu\" IS NULL OR \"ngoai_ngu\" BETWEEN 0 AND 10");

            table.HasCheckConstraint(
                "ck_students_vat_li",
                "\"vat_li\" IS NULL OR \"vat_li\" BETWEEN 0 AND 10");

            table.HasCheckConstraint(
                "ck_students_hoa_hoc",
                "\"hoa_hoc\" IS NULL OR \"hoa_hoc\" BETWEEN 0 AND 10");

            table.HasCheckConstraint(
                "ck_students_sinh_hoc",
                "\"sinh_hoc\" IS NULL OR \"sinh_hoc\" BETWEEN 0 AND 10");

            table.HasCheckConstraint(
                "ck_students_lich_su",
                "\"lich_su\" IS NULL OR \"lich_su\" BETWEEN 0 AND 10");

            table.HasCheckConstraint(
                "ck_students_dia_li",
                "\"dia_li\" IS NULL OR \"dia_li\" BETWEEN 0 AND 10");

            table.HasCheckConstraint(
                "ck_students_gdcd",
                "\"gdcd\" IS NULL OR \"gdcd\" BETWEEN 0 AND 10");
        });

        student.HasKey(s => s.Sbd);

        student.Property(s => s.Sbd)
            .HasColumnName("sbd")
            .HasColumnType("char(8)");

        student.Property(s => s.Math)
            .HasColumnName("toan")
            .HasPrecision(4, 2);

        student.Property(s => s.Literature)
            .HasColumnName("ngu_van")
            .HasPrecision(4, 2);

        student.Property(s => s.ForeignLanguage)
            .HasColumnName("ngoai_ngu")
            .HasPrecision(4, 2);

        student.Property(s => s.Physics)
            .HasColumnName("vat_li")
            .HasPrecision(4, 2);

        student.Property(s => s.Chemistry)
            .HasColumnName("hoa_hoc")
            .HasPrecision(4, 2);

        student.Property(s => s.Biology)
            .HasColumnName("sinh_hoc")
            .HasPrecision(4, 2);

        student.Property(s => s.History)
            .HasColumnName("lich_su")
            .HasPrecision(4, 2);

        student.Property(s => s.Geography)
            .HasColumnName("dia_li")
            .HasPrecision(4, 2);

        student.Property(s => s.CivicEducation)
            .HasColumnName("gdcd")
            .HasPrecision(4, 2);

        student.Property(s => s.ForeignLanguageCode)
            .HasColumnName("ma_ngoai_ngu")
            .HasColumnType("varchar(2)");
    }
}
