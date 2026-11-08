
using System.Globalization;
using Npgsql;
using NpgsqlTypes;

namespace GScores.Seed;

public class StudentCsvSeeder {
    private readonly IConfiguration _configuration;

    public StudentCsvSeeder(IConfiguration configuration) {
        _configuration = configuration;
    }

    public async Task<long> SeedAsync(
        string csvPath,
        bool force = false,
        CancellationToken cancellationToken = default) {
        if (!File.Exists(csvPath)) {
            throw new FileNotFoundException(
                "Student CSV file was not found.", csvPath);
        }

        var connectionString = _configuration
            .GetConnectionString("Direct");

        if (string.IsNullOrWhiteSpace(connectionString)) {
            throw new InvalidOperationException(
                "Direct database connection string is missing.");
        }

        await using var connection =
            new NpgsqlConnection(connectionString);

        await connection.OpenAsync(cancellationToken);

        await using var transaction =
            await connection.BeginTransactionAsync(cancellationToken);

        await using (var lockCommand = new NpgsqlCommand(
            "LOCK TABLE students IN ACCESS EXCLUSIVE MODE;",
            connection,
            transaction)) {
            await lockCommand.ExecuteNonQueryAsync(cancellationToken);
        }

        // Check whether data already exists.
        await using (var countCommand = new NpgsqlCommand(
            "SELECT COUNT(*) FROM students;",
            connection,
            transaction)) {
            var existingCount = (long)(
                await countCommand.ExecuteScalarAsync(cancellationToken)
                ?? 0L);

            if (existingCount > 0 && !force) {
                await transaction.CommitAsync(cancellationToken);

                Console.WriteLine(
                    $"Seeding skipped: {existingCount:N0} records already exist.");

                return 0;
            }
        }

        // Replace existing records only when force = true.
        if (force) {
            await using var truncateCommand = new NpgsqlCommand(
                "TRUNCATE TABLE students;",
                connection,
                transaction);

            await truncateCommand.ExecuteNonQueryAsync(cancellationToken);
        }

        const string copySql = """
            COPY students (
                sbd,
                toan,
                ngu_van,
                ngoai_ngu,
                vat_li,
                hoa_hoc,
                sinh_hoc,
                lich_su,
                dia_li,
                gdcd,
                ma_ngoai_ngu
            )
            FROM STDIN (FORMAT BINARY);
            """;

        string[] expectedHeaders =
        {
            "sbd",
            "toan",
            "ngu_van",
            "ngoai_ngu",
            "vat_li",
            "hoa_hoc",
            "sinh_hoc",
            "lich_su",
            "dia_li",
            "gdcd",
            "ma_ngoai_ngu"
        };

        long importedCount = 0;

        using var reader = new StreamReader(csvPath);

        // Read and validate the header.
        var headerLine = await reader.ReadLineAsync();

        if (headerLine == null) {
            throw new InvalidDataException("CSV file is empty.");
        }

        var headers = headerLine.Split(',');

        if (!headers.SequenceEqual(
            expectedHeaders,
            StringComparer.OrdinalIgnoreCase)) {
            throw new InvalidDataException(
                "CSV headers do not match the expected dataset format.");
        }

        using (var importer = connection.BeginBinaryImport(copySql)) {
            string? line;

            while ((line = await reader.ReadLineAsync()) != null) {
                cancellationToken.ThrowIfCancellationRequested();

                var fields = line.Split(',');

                if (fields.Length != 11) {
                    throw new InvalidDataException(
                        $"Invalid number of columns at CSV line {importedCount + 2}.");
                }

                var sbd = fields[0].Trim();

                if (sbd.Length != 8) {
                    throw new InvalidDataException(
                        $"Invalid student registration number at CSV line {importedCount + 2}.");
                }

                importer.StartRow();

                importer.Write(sbd, NpgsqlDbType.Char);

                // Exam scores.
                for (var i = 1; i <= 9; i++) {
                    WriteNullableDecimal(importer, fields[i]);
                }

                // Foreign language code.
                var languageCode = fields[10].Trim();

                if (string.IsNullOrWhiteSpace(languageCode)) {
                    importer.WriteNull();
                }
                else {
                    importer.Write(languageCode, NpgsqlDbType.Varchar);
                }

                importedCount++;

                if (importedCount % 100_000 == 0) {
                    Console.WriteLine(
                        $"Imported {importedCount:N0} records...");
                }
            }

            // Finalize COPY operation.
            importer.Complete();
        }

        // Commit only after the entire import succeeds.
        await transaction.CommitAsync(cancellationToken);

        Console.WriteLine(
            $"Successfully imported {importedCount:N0} students.");

        return importedCount;
    }

    private static void WriteNullableDecimal(
        NpgsqlBinaryImporter importer,
        string rawValue) {
        var value = rawValue.Trim();

        if (string.IsNullOrWhiteSpace(value)) {
            importer.WriteNull();
            return;
        }

        if (!decimal.TryParse(
            value,
            NumberStyles.Number,
            CultureInfo.InvariantCulture,
            out var score)) {
            throw new InvalidDataException(
                $"Invalid score value: '{value}'.");
        }

        importer.Write(score, NpgsqlDbType.Numeric);
    }
}
