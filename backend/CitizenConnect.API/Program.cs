using CitizenConnect.Application.Interfaces.Services;
using CitizenConnect.Application.Services;
using CitizenConnect.Infrastructure.Data;
using CitizenConnect.Interfaces.Services;
using CitizenConnect.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ==============================
// CONTROLLERS
// ==============================
builder.Services.AddControllers();

// ==============================
// SWAGGER / OPENAPI
// ==============================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ==============================
// EF CORE - SQL SERVER
// ==============================
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ==============================
// APPLICATION SERVICES
// ==============================
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IComplaintService, ComplaintService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<ICitizenService, CitizenService>();
builder.Services.AddScoped<ISuggestionService, SuggestionService>();
// ==============================
// CORS - Allow frontend origins
// ==============================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://127.0.0.1:5500",
                "http://localhost:5500",
                "http://127.0.0.1:5501",
                "http://localhost:5501")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// ==============================
// MIDDLEWARE PIPELINE
// ==============================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// CORS must come before routing, auth, and controllers
app.UseCors("AllowFrontend");

// Skip HTTPS redirection in development to avoid port-resolution warnings
// when the frontend calls HTTP endpoints directly
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

app.Run();
