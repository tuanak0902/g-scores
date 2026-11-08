# G-Scores

A web app for exploring the 2024 Vietnamese national high school exam (THPT) results, covering **1,061,605 candidates**. It lets you look up a student's scores by registration number, see how each subject's scores are distributed across four performance levels, and view the top 10 students of group A (Math + Physics + Chemistry). The interface is available in English and Vietnamese.

Built as a coding assignment for Golden Owl.

<!-- TODO: add a screenshot -->

## Live demo

- **App:** https://g-scores-three.vercel.app/
- **API:** https://gscores-api-tkow.onrender.com
- **Repository:** https://github.com/tuanak0902/g-scores

> **Cold start note:** the API runs on a free Render instance and the database on Neon's free tier. Both go to sleep when idle, so the **first request can take around 30 seconds**. After that, responses are fast.

## Features

| Feature | Description |
|---|---|
| **Search Scores** | Enter an 8-digit registration number (`sbd`) to see all subject scores, each with a level. Subjects the student did not take are shown as not taken. |
| **Reports** | Per-subject chart counting students in four levels: **Excellent** (>= 8), **Good** (6 to < 8), **Average** (4 to < 6), **Poor** (< 4). |
| **Top 10 (group A)** | The ten best students ranked by Math + Physics + Chemistry. Only students with all three scores qualify. |
| **Language switch** | English and Vietnamese. |
| **Responsive layout** | Works on desktop, tablet and phone. |

## Tech stack

| Layer | Choice |
|---|---|
| Backend | ASP.NET Core Web API (C#, .NET 8), Entity Framework Core + Npgsql |
| Database | PostgreSQL (hosted on Neon) |
| Frontend | React, TypeScript, Vite, React Router, Redux Toolkit, Recharts, react-i18next, Zod |
| Hosting | Render (API), Vercel (web), Neon (database) |
| Containers | Dockerfiles for the backend and the frontend |

### Design decisions

- **One wide `students` table** with a nullable column per subject, instead of a normalized `students / subjects / scores` design. With about 1.06M students this keeps the table at about 1M rows rather than about 7M, makes each feature a single lookup or scan, and fits comfortably in a free database tier.
- **A blank score is stored as `NULL`, never `0`.** A student who did not take a subject is excluded from that subject's report.
- **Registration number is kept as text** (`char(8)`) so leading zeros are preserved (`01000001`).
- **Object-oriented subject model.** Subjects, subject groups and score levels are modeled as classes in `Domain/`, so the level thresholds (8, 6, 4) and the group A definition live in one place instead of being hard-coded in queries.
- **ORM for all normal queries** through Entity Framework Core, with the schema created by migrations.
- **Input validation** on both sides: the API rejects invalid registration numbers with a clean error, and the frontend validates the form before calling the API.

## Project structure

```
g-scores/
├── backend/
│   ├── Dockerfile
│   └── GScores/
│       ├── Controllers/     API endpoints
│       ├── Data/            DbContext and Entities/
│       ├── Dataset/         CSV used by the seeder
│       ├── Domain/          Subject, group and score-level model
│       ├── Dtos/            Response models
│       ├── Migrations/      EF Core migrations
│       ├── Seed/            CSV seeding code
│       ├── Services/        Business logic
│       ├── Validations/     Input validation
│       └── Program.cs
├── frontend/
│   ├── Dockerfile
│   └── src/
│       ├── api/             API client
│       ├── components/
│       ├── hooks/
│       ├── locales/         English and Vietnamese translations
│       └── pages/
├── data/                    CSV and profile_csv.py (data profiling script)
└── README.md
```

## API

| Method | Route | Description |
|---|---|---|
| GET | `/api/scores/{sbd}` | One student's scores with levels. Returns `400` if `sbd` is not exactly 8 digits and `404` if the student does not exist. |
| GET | `/api/reports/score-distribution` | For each subject, the number of students in each of the four levels. |
| GET | `/api/reports/top-students?group=A&limit=10` | Top students of a subject group, with their scores and total. |
| GET | `/health` | Health check. |

> Verify the routes above against your controllers before publishing and adjust if they differ.

### Rules

- **Levels** (lower bound inclusive): Excellent `>= 8`, Good `>= 6 and < 8`, Average `>= 4 and < 6`, Poor `< 4`. A score of exactly 8.0 is Excellent.
- **Subjects not taken** are excluded from that subject's report.
- **Top 10 eligibility:** a student must have math, physics and chemistry scores.

## Data

The dataset is the 2024 THPT exam results. Each row is one candidate:

`sbd, toan, ngu_van, ngoai_ngu, vat_li, hoa_hoc, sinh_hoc, lich_su, dia_li, gdcd, ma_ngoai_ngu`

The CSV is included in the repository in two places:

| Path | Purpose |
|---|---|
| `data/diem_thi_thpt_2024.csv` | Raw dataset, used with the profiling script |
| `backend/GScores/Dataset/diem_thi_thpt_2024.csv` | Copy used by the seeding code |

### Data profile

Run the profiling script to reproduce these checks:

```bash
python data/profile_csv.py
```

Results on the provided file:

- **1,061,605** candidate records
- Has a header row
- No duplicate registration numbers
- No scores outside 0 to 10 and no malformed rows
- `ma_ngoai_ngu` (foreign language code) is stored as provided

## Running locally

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) 20 or newer
- A PostgreSQL database (local, or a free [Neon](https://neon.tech) project)

### 1. Backend

```bash
cd backend/GScores

# Configure the database connection (PowerShell: $env:ConnectionStrings__Default = "...")
export ConnectionStrings__Default="Host=localhost;Port=5432;Database=gscores;Username=postgres;Password=postgres"
export Cors__AllowedOrigin="http://localhost:5173"

# Create the schema
dotnet ef database update

# Import the CSV into the database
dotnet run --project ./GScores.csproj -- --seed-csv "Dataset/diem_thi_thpt_2024.csv"

# Start the API
dotnet run --project ./GScores.csproj
```

For a hosted database such as Neon, use the **direct** (non-pooled) connection string for migrations and seeding, and add `SSL Mode=Require`. The import covers about 1.06 million rows, so it takes a few minutes.

### 2. Frontend

```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:5000" > .env.local   # use the URL your API prints on startup
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173).

### Environment variables

| Variable | Used by | Example |
|---|---|---|
| `ConnectionStrings__Default` | API and seeder | `Host=...;Database=...;Username=...;Password=...;SSL Mode=Require` |
| `Cors__AllowedOrigin` | API | `http://localhost:5173` or the live frontend URL |
| `VITE_API_URL` | Frontend (build time) | `http://localhost:5000` or the live API URL |

Never commit real credentials. `VITE_API_URL` is baked in at build time, so rebuild the frontend after changing it.

### Docker

Each part has its own Dockerfile:

```bash
# Backend
docker build -t gscores-api ./backend
docker run -p 8080:8080 -e ConnectionStrings__Default="..." -e Cors__AllowedOrigin="http://localhost:3000" gscores-api

# Frontend
docker build -t gscores-web --build-arg VITE_API_URL=http://localhost:8080 ./frontend
docker run -p 3000:80 gscores-web
```

## Deployment

| Part | Host | Notes |
|---|---|---|
| Database | Neon | Seeded once from a local machine over the direct connection. |
| API | Render (Docker) | Environment variables: `ConnectionStrings__Default`, `Cors__AllowedOrigin`. Swagger is disabled in production. |
| Web | Vercel | `VITE_API_URL` set at build time; SPA rewrite so routes such as `/reports` survive a refresh. |

## Author

**Quoc Tuan**
- Email: [tuanak0902@gmail.com](mailto:tuanak0902@gmail.com)
- LinkedIn: [linkedin.com/in/quoctuanzzz](https://linkedin.com/in/quoctuanzzz)
- GitHub: [tuanak0902](https://github.com/tuanak0902)