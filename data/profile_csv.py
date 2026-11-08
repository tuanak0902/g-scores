
import csv
from pathlib import Path
from decimal import Decimal, InvalidOperation

CSV_PATH = Path(__file__).parent / "diem_thi_thpt_2024.csv"

EXPECTED_COLUMNS = [
    "sbd", "toan", "ngu_van", "ngoai_ngu", "vat_li",
    "hoa_hoc", "sinh_hoc", "lich_su", "dia_li",
    "gdcd", "ma_ngoai_ngu"
]

SCORE_COLUMNS = range(1, 10)

def main():
    seen = set()
    duplicates = 0
    invalid_rows = 0
    invalid_scores = 0
    invalid_sbd = 0
    language_mismatches = 0
    row_count = 0

    with CSV_PATH.open("r", encoding="utf-8-sig", newline="") as file:
        sample = file.read(8192)
        file.seek(0)

        try:
            dialect = csv.Sniffer().sniff(
                sample, delimiters=",;\t|"
            )
        except csv.Error:
            dialect = csv.excel

        reader = csv.reader(file, dialect)
        first_row = next(reader, None)

        if first_row is None:
            print("CSV is empty.")
            return

        has_header = [
            value.strip().lower() for value in first_row
        ] == EXPECTED_COLUMNS

        print("Delimiter:", repr(dialect.delimiter))
        print("Has header:", has_header)
        print("First row:", first_row)

        def process_row(row):
            nonlocal row_count, duplicates
            nonlocal invalid_rows, invalid_scores
            nonlocal invalid_sbd, language_mismatches

            row_count += 1

            if len(row) != 11:
                invalid_rows += 1
                return

            sbd = row[0].strip()

            if len(sbd) != 8 or not sbd.isdigit():
                invalid_sbd += 1

            if sbd in seen:
                duplicates += 1
            else:
                seen.add(sbd)

            for index in SCORE_COLUMNS:
                value = row[index].strip()

                if not value:
                    continue

                try:
                    score = Decimal(value)
                    if not score.is_finite() or not (0 <= score <= 10):
                        invalid_scores += 1
                except InvalidOperation:
                    invalid_scores += 1

            language_score = row[3].strip()
            language_code = row[10].strip()

            if bool(language_score) != bool(language_code):
                language_mismatches += 1

        if not has_header:
            process_row(first_row)

        for row in reader:
            process_row(row)

    print("\n--- CSV PROFILE ---")
    print("File size (MB):", round(CSV_PATH.stat().st_size / 1024**2, 2))
    print("Data rows:", row_count)
    print("Unique registration numbers:", len(seen))
    print("Duplicate registration numbers:", duplicates)
    print("Malformed rows:", invalid_rows)
    print("Invalid sbd:", invalid_sbd)
    print("Invalid scores:", invalid_scores)
    print("Language/code mismatches:", language_mismatches)

if __name__ == "__main__":
    main()
