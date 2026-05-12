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
            // CAPTCHA VALIDATION
            if (dto.Captcha != "1234")
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid captcha"
                };
            }

            var user = await _context.Users
                .Include(x => x.Role)
                .FirstOrDefaultAsync(x =>
                    x.Email == dto.EmailOrMobile ||
                    x.MobileNo == dto.EmailOrMobile);

            if (user == null)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "User not found"
                };
            }

            user.LastLoginAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new AuthResponseDto
            {
                Success = true,
                Message = "Login successful",
                UserId = user.UserId,
                Role = user.Role.RoleName,
                RedirectUrl = GetRedirectUrl(user.Role.RoleName)
            };
        }

        public async Task<AuthResponseDto> RegisterCitizenAsync(RegisterCitizenDto dto)
        {
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

            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                MobileNo = dto.MobileNo,
                Email = dto.Email ?? "",
                Gender = dto.Gender,
                PreferredLanguage = dto.PreferredLanguage,
                RoleId = 2
            };

            await _context.Users.AddAsync(user);

            await _context.SaveChangesAsync();

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
                RedirectUrl = "/citizen/citizen-dashboard.html"
            };
        }

        public async Task<AuthResponseDto> RegisterPoliticianAsync(RegisterPoliticianDto dto)
        {
            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                MobileNo = dto.MobileNo,
                Email = dto.Email ?? "",
                RoleId = 3
            };

            await _context.Users.AddAsync(user);

            await _context.SaveChangesAsync();

            var politician = new Politician
            {
                UserId = user.UserId,
                PartyName = dto.PartyName,
                PoliticianRole = dto.PoliticianRole,
                GovernmentId = dto.GovernmentId,
                WardId = dto.WardId,
                JurisdictionTypeId = dto.JurisdictionTypeId
            };

            await _context.Politicians.AddAsync(politician);

            await _context.SaveChangesAsync();

            return new AuthResponseDto
            {
                Success = true,
                Message = "Politician registered successfully",
                UserId = user.UserId,
                Role = "Politician",
                RedirectUrl = "/politician/politician-dashboard.html"
            };
        }

        private string GetRedirectUrl(string role)
        {
            return role switch
            {
                "Admin" => "/admin/admin-dashboard.html",
                "Politician" => "/politician/politician-dashboard.html",
                _ => "/citizen/citizen-dashboard.html"
            };
        }
    }
}