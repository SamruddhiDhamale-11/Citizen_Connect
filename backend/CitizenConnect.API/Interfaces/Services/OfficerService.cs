using CitizenConnect.Application.DTOs.Officer;
using CitizenConnect.Application.Interfaces.Services;
using CitizenConnect.Domain.Entities;
using CitizenConnect.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CitizenConnect.Application.Services
{
    public class OfficerService : IOfficerService
    {
        private readonly ApplicationDbContext _context;

        public OfficerService(
            ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Create Officer
        /// </summary>
        public async Task<OfficerResponseDto>
            CreateOfficerAsync(
                OfficerRequestDto dto)
        {
            // Check department exists

            var departmentExists =
                await _context.Departments
                    .AnyAsync(x =>
                        x.DepartmentId
                        == dto.DepartmentId);

            if (!departmentExists)
            {
                throw new Exception(
                    "Department not found.");
            }

            // Check duplicate email

            var emailExists =
                await _context.Officers
                    .AnyAsync(x =>
                        x.Email == dto.Email);
if (emailExists)
{
    return new OfficerResponseDto
    {
        OfficerId = 0,
        FullName = "",
        Email = "EMAIL_EXISTS",
        MobileNumber = "",
        Designation = "",
        DepartmentId = 0,
        DepartmentName = "",
        IsAvailable = false
    };
}
           var exists = await _context.Officers
    .AnyAsync(o => o.MobileNumber == dto.MobileNumber);

if (exists)
{
    return new OfficerResponseDto
    {
        OfficerId = 0,
        FullName = "",
        Email = "MOBILE_EXISTS",
        MobileNumber = "",
        Designation = "",
        DepartmentId = 0,
        DepartmentName = "",
        IsAvailable = false
    };
}

            var officer = new Officer
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                MobileNumber = dto.MobileNumber,
                Designation = dto.Designation,
                DepartmentId = dto.DepartmentId,
                IsAvailable = dto.IsAvailable
            };

            _context.Officers.Add(officer);

            await _context.SaveChangesAsync();

            var department =
                await _context.Departments
                    .FirstAsync(x =>
                        x.DepartmentId
                        == officer.DepartmentId);

            return new OfficerResponseDto
            {
                OfficerId = officer.OfficerId,

                FullName =
                    officer.FirstName
                    + " "
                    + officer.LastName,

                Email = officer.Email,

                MobileNumber =
                    officer.MobileNumber,

                Designation =
                    officer.Designation,

                DepartmentId =
                    officer.DepartmentId,

                DepartmentName =
                    department.DepartmentName,

                IsAvailable =
                    officer.IsAvailable
            };
        }

        /// <summary>
        /// Get All Officers
        /// </summary>
        public async Task<List<OfficerResponseDto>>
            GetAllOfficersAsync()
        {
           return await _context.Officers
    .Include(x => x.Department)
    .Include(x => x.OfficerCategoryMappings)
        .ThenInclude(m => m.ComplaintCategory)
    .Select(x => new OfficerResponseDto
    {
        OfficerId = x.OfficerId,
        FullName = x.FirstName + " " + x.LastName,
        Email = x.Email,
        MobileNumber = x.MobileNumber,
        Designation = x.Designation,
        DepartmentId = x.DepartmentId,
        DepartmentName = x.Department.DepartmentName,
        IsAvailable = x.IsAvailable,

        CategoryNames = x.OfficerCategoryMappings
            .Where(m => m.IsActive)
            .Select(m => m.ComplaintCategory.CategoryName)
            .ToList()
    })
    .ToListAsync();
        }

        /// <summary>
        /// Get Officer By Id
        /// </summary>
        public async Task<OfficerResponseDto?>
            GetOfficerByIdAsync(int officerId)
        {
            return await _context.Officers
                .Include(x => x.Department)
                .Where(x =>
                    x.OfficerId == officerId)
                .Select(x =>
                    new OfficerResponseDto
                    {
                        OfficerId = x.OfficerId,

                        FullName =
                            x.FirstName
                            + " "
                            + x.LastName,

                        Email = x.Email,

                        MobileNumber =
                            x.MobileNumber,

                        Designation =
                            x.Designation,

                        DepartmentId =
                            x.DepartmentId,

                        DepartmentName =
                            x.Department.DepartmentName,

                        IsAvailable =
                            x.IsAvailable
                    })
                .FirstOrDefaultAsync();
        }

        /// <summary>
        /// Update Officer
        /// </summary>
        public async Task<bool>
            UpdateOfficerAsync(
                int officerId,
                OfficerRequestDto dto)
        {
            var officer =
                await _context.Officers
                    .FirstOrDefaultAsync(x =>
                        x.OfficerId
                        == officerId);

            if (officer == null)
            {
                return false;
            }

            officer.FirstName =
                dto.FirstName;

            officer.LastName =
                dto.LastName;

            officer.Email =
                dto.Email;

            officer.MobileNumber =
                dto.MobileNumber;

            officer.Designation =
                dto.Designation;

            officer.DepartmentId =
                dto.DepartmentId;

            officer.IsAvailable =
                dto.IsAvailable;

            await _context.SaveChangesAsync();

            return true;
        }

        /// <summary>
        /// Delete Officer
        /// </summary>
        public async Task<bool>
            DeleteOfficerAsync(int officerId)
        {
            var officer =
                await _context.Officers
                    .FirstOrDefaultAsync(x =>
                        x.OfficerId
                        == officerId);

            if (officer == null)
            {
                return false;
            }

            _context.Officers.Remove(officer);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}