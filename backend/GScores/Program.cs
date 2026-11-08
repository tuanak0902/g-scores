using GScores.Data;
using GScores.Seed;
using GScores.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ==========================================
// SERVICES
// ==========================================
builder.Services.AddControllers();
builder.Services.AddProblemDetails();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// PostgreSQL + Entity Framework Core.
var connectionString = builder.Configuration.GetConnectionString("Default");

if (string.IsNullOrWhiteSpace(connectionString)) {
    throw new InvalidOperationException(
        "Database connection string 'Default' is missing.");
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        connectionString,
        npgsqlOptions => npgsqlOptions.EnableRetryOnFailure()
    )
);

// CSV seeder.
builder.Services.AddScoped<StudentCsvSeeder>();

// Report queries (score distribution, top 10 of group A).
builder.Services.AddScoped<ReportService>();

// CORS: allow only the React app. Set Cors__AllowedOrigin on the host.
var allowedOrigin = builder.Configuration["Cors:AllowedOrigin"]
    ?? "http://localhost:5173";

builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(allowedOrigin)
              .AllowAnyHeader()
              .AllowAnyMethod()));

var app = builder.Build();

// ==========================================
// CSV SEEDING COMMAND
// ==========================================
if (args.Length >= 2 && args[0] == "--seed-csv") {
    Console.WriteLine("Starting CSV seeder...");

    var csvPath = Path.GetFullPath(args[1]);
    var force = args.Contains("--force");

    Console.WriteLine($"CSV path: {csvPath}");

    using var scope = app.Services.CreateScope();

    var seeder = scope.ServiceProvider
        .GetRequiredService<StudentCsvSeeder>();

    await seeder.SeedAsync(csvPath, force);

    Console.WriteLine("Seeding completed.");

    return;
}

// ==========================================
// NORMAL API PIPELINE
// ==========================================
app.UseExceptionHandler();   // unhandled errors -> ProblemDetails JSON

if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.Run();