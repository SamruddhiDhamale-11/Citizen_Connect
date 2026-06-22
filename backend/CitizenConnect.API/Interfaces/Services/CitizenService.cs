using CitizenConnect.DTOs.Citizen;
using CitizenConnect.Infrastructure.Data;
using CitizenConnect.Interfaces.Services;
using Microsoft.EntityFrameworkCore;


namespace CitizenConnect.Services
{
    public class CitizenService : ICitizenService
    {
        private readonly ApplicationDbContext _context;

        public CitizenService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<CitizenProfileDto?> GetProfileByUserIdAsync(int userId)
        {
            var row = await _context.Citizens
                .AsNoTracking()
                .Include(c => c.User)
                .Include(c => c.Ward)
                .Include(c => c.ResidenceType)
                .Where(c => c.UserId == userId && c.User.IsActive)
                .Select(c => new
                {
                    c.CitizenId,
                    c.UserId,
                    c.User.FirstName,
                    c.User.MiddleName,
                    c.User.LastName,
                    c.User.MobileNo,
                    c.User.WhatsappNo,
                    c.User.Email,
                    c.WardId,
                    c.Ward.WardName,
                    c.Ward.WardNumber,
                    c.ResidenceType.ResidenceTypeName,
                    c.CreatedAt
                })
                .FirstOrDefaultAsync();

            if (row == null)
                return null;

            var fullName = string.Join(" ",
                new[] { row.FirstName, row.MiddleName, row.LastName }
                    .Where(s => !string.IsNullOrWhiteSpace(s)));

            var initials = BuildInitials(row.FirstName, row.LastName);
            var wardDisplay = FormatWardDisplay(row.WardName, row.WardNumber);

            return new CitizenProfileDto
            {
                Success = true,
                CitizenId = row.CitizenId,
                UserId = row.UserId,
                FirstName = row.FirstName,
                MiddleName = row.MiddleName,
                LastName = row.LastName,
                FullName = fullName,
                Initials = initials,
                MobileNo = row.MobileNo,
                WhatsappNo = row.WhatsappNo,
                Email = row.Email,
                WardId = row.WardId,
                WardDisplay = wardDisplay,
                ResidenceTypeName = row.ResidenceTypeName,
                RegisteredAt = row.CreatedAt
            };
        }

        public async Task<bool> UpdateProfileAsync(
    int citizenId,
    UpdateCitizenProfileDto dto)
{
    var citizen = await _context.Citizens
        .Include(x => x.User)
        .FirstOrDefaultAsync(
            x => x.CitizenId == citizenId);

    if (citizen == null)
        return false;

    citizen.User.FirstName =
        dto.FirstName;

    citizen.User.MiddleName =
        dto.MiddleName;

    citizen.User.LastName =
        dto.LastName;

    citizen.User.MobileNo =
        dto.MobileNo;

    citizen.User.WhatsappNo =
        dto.WhatsappNo;

    citizen.User.Email =
        dto.Email;

    await _context.SaveChangesAsync();

    return true;
}

        private static string BuildInitials(string firstName, string lastName)
        {
            var a = string.IsNullOrWhiteSpace(firstName) ? "" : firstName.Trim()[0].ToString();
            var b = string.IsNullOrWhiteSpace(lastName) ? "" : lastName.Trim()[0].ToString();
            var initials = (a + b).ToUpperInvariant();
            return string.IsNullOrEmpty(initials) ? "?" : initials;
        }

        private static string FormatWardDisplay(string wardName, string wardNumber)
        {
            if (!string.IsNullOrWhiteSpace(wardName))
                return wardName.Trim();

            if (!string.IsNullOrWhiteSpace(wardNumber))
                return "Ward " + wardNumber.Trim();

            return "Ward —";
        }
    }
}
