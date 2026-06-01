using CitizenConnect.Application.DTOs.Auth;
using CitizenConnect.Application.Interfaces.Services;
using CitizenConnect.Domain.Entities;
using CitizenConnect.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CitizenConnect.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;

        public AuthService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto dto)
        {
            // Normalize input — trim whitespace
            var input = (dto.EmailOrMobile ?? "").Trim();
            var password = (dto.Password ?? "").Trim();

            // ==============================
            // ADMIN — hardcoded credentials
            // Handled before DB lookup
            // ==============================
            const string AdminUsername = "admin@citizenconnect.gov";
            const string AdminPassword = "Admin@CC2026";

            if (input.Equals(AdminUsername, StringComparison.OrdinalIgnoreCase))
            {
                if (password != AdminPassword)
                {
                    return new AuthResponseDto
                    {
                        Success = false,
                        Message = "Invalid admin credentials."
                    };
                }

                return new AuthResponseDto
                {
                    Success     = true,
                    Message     = "Login successful",
                    UserId      = 0,
                    Role        = "Admin",
                    RedirectUrl = "../admin/admin-dashboard.html"
                };
            }

            // ==============================
            // CITIZEN / POLITICIAN — DB lookup
            // Password optional: if omitted, allow when account exists.
            // If provided, must match stored hash.
            // DB users with Admin role must always provide password.
            // ==============================
            var user = await _context.Users
                .Include(x => x.Role)
                .FirstOrDefaultAsync(x =>
                    x.Email.ToLower()  == input.ToLower() ||
                    x.MobileNo         == input);

            if (user == null)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid credentials. No account found with that email or mobile number."
                };
            }

            var roleName = user.Role?.RoleName ?? string.Empty;
            var isAdminRole = roleName.Equals(
                "Admin",
                StringComparison.OrdinalIgnoreCase);

            if (isAdminRole)
            {
                if (string.IsNullOrWhiteSpace(password))
                {
                    return new AuthResponseDto
                    {
                        Success = false,
                        Message = "Password is required."
                    };
                }

                if (user.PasswordHash != password)
                {
                    return new AuthResponseDto
                    {
                        Success = false,
                        Message = "Invalid credentials. Please check your password."
                    };
                }
            }
            else
            {
                if (!string.IsNullOrWhiteSpace(password) &&
                    user.PasswordHash != password)
                {
                    return new AuthResponseDto
                    {
                        Success = false,
                        Message = "Invalid credentials. Please check your password."
                    };
                }
            }

            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return new AuthResponseDto
            {
                Success     = true,
                Message     = "Login successful",
                UserId      = user.UserId,
                Role        = user.Role!.RoleName,
                RedirectUrl = GetRedirectUrl(user.Role!.RoleName)
            };
        }

        public async Task<AuthResponseDto> RegisterCitizenAsync(RegisterCitizenDto dto)
        {
            try
            {
                // ==============================
                // DUPLICATE CHECK
                // ==============================
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(x =>
                        x.MobileNo == dto.MobileNo ||
                        x.Email == dto.Email);

                if (existingUser != null)
                {
                    return new AuthResponseDto
                    {
                        Success = false,
                        Message = "User already exists"
                    };
                }

                // ==============================
                // TASK 1: VALIDATE FOREIGN KEYS
                // before touching the DB at all
                // ==============================
                var wardExists = await _context.Wards
                    .AnyAsync(w => w.WardId == dto.WardId);

                var residenceTypeExists = await _context.ResidenceTypes
                    .AnyAsync(r => r.ResidenceTypeId == dto.ResidenceTypeId);

                if (!wardExists || !residenceTypeExists)
                {
                    return new AuthResponseDto
                    {
                        Success = false,
                        Message = "Invalid Ward or Residence Type"
                    };
                }

                // ==============================
                // TASK 3: STEP 1 — CREATE USER
                // ==============================
                var user = new User
                {
                    FirstName         = dto.FirstName,
                    LastName          = dto.LastName,
                    MobileNo          = dto.MobileNo,
                    Email             = dto.Email ?? "",
                    Gender            = dto.Gender,
                    PreferredLanguage = dto.PreferredLanguage,
                    PasswordHash      = dto.Password ?? "",
                    RoleId            = 2
                };

                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();

                // ==============================
                // TASK 3: STEP 2 — CREATE CITIZEN
                // FK already validated above
                // ==============================
                var citizen = new Citizen
                {
                    UserId = user.UserId,
                    DateOfBirth = dto.DateOfBirth,
                    WardId = dto.WardId,
                    ResidenceTypeId = dto.ResidenceTypeId,
                    IsVoterRegistered = dto.IsVoterRegistered
                };

                await _context.Citizens.AddAsync(citizen);
                await _context.SaveChangesAsync();

                return new AuthResponseDto
                {
                    Success = true,
                    Message = "Citizen registered successfully",
                    UserId = user.UserId,
                    Role = "Citizen",
                    RedirectUrl = "../citizen/citizen-dashboard.html"
                };
            }
            catch (Exception ex)
            {
                // ==============================
                // TASK 2: PREVENT BACKEND CRASH
                // Log and return clean error
                // ==============================
                return new AuthResponseDto
                {
                    Success = false,
                    Message = $"Registration failed: {ex.InnerException?.Message ?? ex.Message}"
                };
            }
        }

        public async Task<AuthResponseDto> RegisterPoliticianAsync(RegisterPoliticianDto dto)
        {
            try
            {
                // ==============================
                // DUPLICATE CHECK
                // ==============================
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(x =>
                        x.MobileNo == dto.MobileNo ||
                        x.Email == dto.Email);

                if (existingUser != null)
                {
                    return new AuthResponseDto
                    {
                        Success = false,
                        Message = "User already exists"
                    };
                }


                var governmentIdExists =
    await _context.Politicians
    .AnyAsync(x => x.GovernmentId == dto.GovernmentId);

                if (governmentIdExists)
                {
                    return new AuthResponseDto
                    {
                        Success = false,
                        Message = "Government ID already exists"
                    };
                }

                // ==============================
                // VALIDATE FOREIGN KEYS
                // ==============================
                // NOTE: WardId is no longer collected from the politician
                // registration form (the ward dropdown was removed).
                // Politicians identify their ward via WardNumber and WardName
                // text fields. We only validate JurisdictionTypeId here.
                var jurisdictionExists = await _context.Jurisdictions
    .AnyAsync(j => j.JurisdictionId == dto.JurisdictionId);

                if (!jurisdictionExists)
                {
                    return new AuthResponseDto
                    {
                        Success = false,
                        Message = "Invalid Jurisdiction"
                    };
                }

                if (!jurisdictionExists)
                {
                    return new AuthResponseDto
                    {
                        Success = false,
                        Message = "Invalid Jurisdiction Type"
                    };
                }

                // ==============================
                // SAVE FILES
                // ==============================
                string? profilePhotoPath = null;
                string? idProofPath      = null;

                if (dto.ProfilePhoto != null && dto.ProfilePhoto.Length > 0)
                {
                    var ext      = Path.GetExtension(dto.ProfilePhoto.FileName);
                    var fileName = $"{Guid.NewGuid()}{ext}";
                    var savePath = Path.Combine("wwwroot", "uploads", "politicians", fileName);
                    Directory.CreateDirectory(Path.GetDirectoryName(savePath)!);
                    using var stream = new FileStream(savePath, FileMode.Create);
                    await dto.ProfilePhoto.CopyToAsync(stream);
                    profilePhotoPath = $"/uploads/politicians/{fileName}";
                }

                if (dto.IdProof != null && dto.IdProof.Length > 0)
                {
                    var ext      = Path.GetExtension(dto.IdProof.FileName);
                    var fileName = $"{Guid.NewGuid()}{ext}";
                    var savePath = Path.Combine("wwwroot", "uploads", "idproofs", fileName);
                    Directory.CreateDirectory(Path.GetDirectoryName(savePath)!);
                    using var stream = new FileStream(savePath, FileMode.Create);
                    await dto.IdProof.CopyToAsync(stream);
                    idProofPath = $"/uploads/idproofs/{fileName}";
                }


                if (dto.WardId.HasValue)
                {
                    var wardExists = await _context.Wards
                        .AnyAsync(w => w.WardId == dto.WardId.Value);

                    if (!wardExists)
                    {
                        return new AuthResponseDto
                        {
                            Success = false,
                            Message = "Invalid Ward"
                        };
                    }
                }
                // ==============================
                // CREATE USER
                // ==============================
                var user = new User
                {
                    FirstName    = dto.FirstName,
                    LastName     = dto.LastName,
                    MobileNo     = dto.MobileNo,
                    Email        = dto.Email ?? "",
                    Gender       = dto.Gender,
                    PasswordHash = dto.Password ?? "",
                    RoleId       = 3
                };

                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();

                // ==============================
                // CREATE POLITICIAN
                // ==============================
                var politician = new Politician
                {
                    UserId = user.UserId,

                    PartyName = dto.PartyName,

                    PoliticianRole = dto.PoliticianRole,

                    Age = dto.Age,

                    Gender = dto.Gender,

                    Address = dto.Address,

                    GovernmentId = dto.GovernmentId,

                    JurisdictionId = dto.JurisdictionId,

                    WardId = dto.WardId,

                    ProfilePhoto = profilePhotoPath,

                    IdProofPath = idProofPath
                };

                await _context.Politicians.AddAsync(politician);
                await _context.SaveChangesAsync();

                return new AuthResponseDto
                {
                    Success = true,
                    Message = "Politician registered successfully",
                    UserId  = user.UserId,
                    Role    = "Politician",
                    RedirectUrl = "../politician/politician-dashboard.html"
                };
            }
            catch (Exception ex)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = $"Registration failed: {ex.InnerException?.Message ?? ex.Message}"
                };
            }
        }

        private string GetRedirectUrl(string role)
        {
            return role switch
            {
                "Admin"      => "../admin/admin-dashboard.html",
                "Politician" => "../politician/politician-dashboard.html",
                _            => "../citizen/citizen-dashboard.html"
            };
        }
    }
}