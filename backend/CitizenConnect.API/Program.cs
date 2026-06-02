using CitizenConnect.API.Configurations;
using CitizenConnect.API.Interfaces.Services;
using CitizenConnect.API.Services;
using CitizenConnect.Application.Interfaces.Services;
using CitizenConnect.Application.Services;
using CitizenConnect.Application.Services.Interfaces;
using CitizenConnect.Infrastructure.Data;
using CitizenConnect.Infrastructure.Seed;
using CitizenConnect.Interfaces.Services;
using CitizenConnect.Services;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);


builder.Services.Configure<CloudinarySettings>(
    builder.Configuration.GetSection("Cloudinary"));
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
builder.Services.AddScoped<IOfficerService,OfficerService>();
builder.Services.AddScoped<IDepartmentService, DepartmentService>();

builder.Services.AddScoped<ICitizenService, CitizenService>();
builder.Services.AddScoped<ISuggestionService,SuggestionService>();
builder.Services.AddScoped<
    IJurisdictionService,
    JurisdictionService>();

builder.Services.AddScoped<
    IFacilityModuleService,
    FacilityModuleService>();

builder.Services.AddScoped<
    IFacilityDataService,
    FacilityDataService>();

builder.Services.AddScoped<
    IFacilityFieldOptionService,
    FacilityFieldOptionService>();

builder.Services.AddScoped<
    IFacilityFieldService,
    FacilityFieldService>();

builder.Services.AddScoped<
    IDemographicService,
    DemographicService>();


builder.Services
    .AddScoped<ICloudinaryService,
               CloudinaryService>();

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

builder.Services.Configure<CloudinarySettings>(
    builder.Configuration.GetSection("CloudinarySettings"));

var app = builder.Build();

// ==============================
// MIDDLEWARE PIPELINE
// ==============================


using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var context =
        services.GetRequiredService<ApplicationDbContext>();

    //await DbInitializer.SeedAsync(context);
}

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
