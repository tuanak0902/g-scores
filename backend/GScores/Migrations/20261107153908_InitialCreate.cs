using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GScores.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "students",
                columns: table => new
                {
                    sbd = table.Column<string>(type: "char(8)", nullable: false),
                    toan = table.Column<decimal>(type: "numeric(4,2)", precision: 4, scale: 2, nullable: true),
                    ngu_van = table.Column<decimal>(type: "numeric(4,2)", precision: 4, scale: 2, nullable: true),
                    ngoai_ngu = table.Column<decimal>(type: "numeric(4,2)", precision: 4, scale: 2, nullable: true),
                    vat_li = table.Column<decimal>(type: "numeric(4,2)", precision: 4, scale: 2, nullable: true),
                    hoa_hoc = table.Column<decimal>(type: "numeric(4,2)", precision: 4, scale: 2, nullable: true),
                    sinh_hoc = table.Column<decimal>(type: "numeric(4,2)", precision: 4, scale: 2, nullable: true),
                    lich_su = table.Column<decimal>(type: "numeric(4,2)", precision: 4, scale: 2, nullable: true),
                    dia_li = table.Column<decimal>(type: "numeric(4,2)", precision: 4, scale: 2, nullable: true),
                    gdcd = table.Column<decimal>(type: "numeric(4,2)", precision: 4, scale: 2, nullable: true),
                    ma_ngoai_ngu = table.Column<string>(type: "varchar(2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_students", x => x.sbd);
                    table.CheckConstraint("ck_students_dia_li", "\"dia_li\" IS NULL OR \"dia_li\" BETWEEN 0 AND 10");
                    table.CheckConstraint("ck_students_gdcd", "\"gdcd\" IS NULL OR \"gdcd\" BETWEEN 0 AND 10");
                    table.CheckConstraint("ck_students_hoa_hoc", "\"hoa_hoc\" IS NULL OR \"hoa_hoc\" BETWEEN 0 AND 10");
                    table.CheckConstraint("ck_students_lich_su", "\"lich_su\" IS NULL OR \"lich_su\" BETWEEN 0 AND 10");
                    table.CheckConstraint("ck_students_ngoai_ngu", "\"ngoai_ngu\" IS NULL OR \"ngoai_ngu\" BETWEEN 0 AND 10");
                    table.CheckConstraint("ck_students_ngu_van", "\"ngu_van\" IS NULL OR \"ngu_van\" BETWEEN 0 AND 10");
                    table.CheckConstraint("ck_students_sinh_hoc", "\"sinh_hoc\" IS NULL OR \"sinh_hoc\" BETWEEN 0 AND 10");
                    table.CheckConstraint("ck_students_toan", "\"toan\" IS NULL OR \"toan\" BETWEEN 0 AND 10");
                    table.CheckConstraint("ck_students_vat_li", "\"vat_li\" IS NULL OR \"vat_li\" BETWEEN 0 AND 10");
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "students");
        }
    }
}
