using CitizenConnect.API.Domain.Enums;
using CitizenConnect.Domain.Entities;
using CitizenConnect.DTOs.Complaint;
using CitizenConnect.Infrastructure.Data;
using CitizenConnect.Interfaces.Services;

using Microsoft.EntityFrameworkCore;

namespace CitizenConnect.Services
{
    public class ComplaintService : IComplaintService
    {
        private readonly ApplicationDbContext _context;

        private readonly IWebHostEnvironment _environment;

        public ComplaintService(
            ApplicationDbContext context,
            IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }


        // =========================================
        // CREATE COMPLAINT
        // =========================================

        public async Task<ComplaintResponseDto> CreateComplaintAsync(
            CreateComplaintDto dto)
        {
            if (dto.Files != null && dto.Files.Any())
            {
                var allowedTypes = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
                {
                    "image/jpeg",
                    "image/jpg",
                    "image/png"
                };

                foreach (var file in dto.Files)
                {
                    if (file.Length > 5 * 1024 * 1024)
                    {
                        throw new InvalidOperationException(
                            "Each attachment must not exceed 5 MB.");
                    }

                    if (!allowedTypes.Contains(file.ContentType))
                    {
                        throw new InvalidOperationException(
                            "Attachments must be JPG or PNG format only.");
                    }
                }
            }

            // Generate Complaint Number
            string complaintNumber =
                $"CC-{DateTime.UtcNow:yyyyMMddHHmmss}";


            var complaint = new Complaint
            {
                ComplaintNumber = complaintNumber,

                CitizenId = dto.CitizenId,

                WardId = dto.WardId,

                ComplaintCategoryId = dto.ComplaintCategoryId,

                Title = dto.Title,

                Description = dto.Description,

                Address = dto.Address,

                Latitude = dto.Latitude,

                Longitude = dto.Longitude,

                Priority = dto.Priority,

                IsAnonymous = dto.IsAnonymous,

                Status = ComplaintStatus.Pending
            };

            await _context.Complaints.AddAsync(complaint);

            await _context.SaveChangesAsync();


            // =========================================
            // FILE UPLOAD
            // =========================================

            if (dto.Files != null && dto.Files.Any())
            {
                string uploadPath = Path.Combine(
                    _environment.WebRootPath,
                    "uploads",
                    "complaints");

                // Create folder if not exists
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }

                foreach (var file in dto.Files)
                {
                    string fileName =
                        Guid.NewGuid().ToString()
                        + Path.GetExtension(file.FileName);

                    string filePath =
                        Path.Combine(uploadPath, fileName);

                    using (var stream =
                           new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    var complaintImage = new ComplaintImage
                    {
                        ComplaintId = complaint.ComplaintId,

                        ImagePath =
                            $"/uploads/complaints/{fileName}",

                        FileType = file.ContentType,

                        FileSize = file.Length
                    };

                    await _context.ComplaintImages
                        .AddAsync(complaintImage);
                }

                await _context.SaveChangesAsync();
            }


            return new ComplaintResponseDto
            {
                ComplaintId = complaint.ComplaintId,

                ComplaintNumber = complaint.ComplaintNumber,

                Title = complaint.Title,

                Priority = complaint.Priority,

                Status = complaint.Status.ToString(),

                CreatedAt = complaint.CreatedAt
            };
        }


        // =========================================
        // GET CITIZEN COMPLAINTS
        // =========================================

        public async Task<List<ComplaintResponseDto>>
            GetCitizenComplaintsAsync(int citizenId)
        {
            return await _context.Complaints
                .Include(c => c.ComplaintCategory)
                .Where(c => c.CitizenId == citizenId)
                .Select(c => new ComplaintResponseDto
                {
                    ComplaintId = c.ComplaintId,

                    ComplaintNumber = c.ComplaintNumber,

                    CategoryName =
                        c.ComplaintCategory.CategoryName,

                    Title = c.Title,

                    Description = c.Description,

                    Address = c.Address,

                    Status = c.Status.ToString(),

                    Priority = c.Priority,

                    CreatedAt = c.CreatedAt
                })
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }


        // =========================================
        // GET COMPLAINT DETAILS
        // =========================================

        public async Task<ComplaintDetailsDto?>
            GetComplaintDetailsAsync(int complaintId)
        {
            var complaint = await _context.Complaints
                .AsNoTracking()
                .Include(c => c.ComplaintCategory)
                .Include(c => c.Citizen)
                    .ThenInclude(cit => cit.User)
                .Include(c => c.ComplaintImages)
                .FirstOrDefaultAsync(c => c.ComplaintId == complaintId);

            if (complaint == null)
            {
                return null;
            }

            return new ComplaintDetailsDto
            {
                ComplaintId = complaint.ComplaintId,
                ComplaintNumber = complaint.ComplaintNumber,
                CategoryName = complaint.ComplaintCategory?.CategoryName ?? string.Empty,
                Title = complaint.Title,
                Description = complaint.Description ?? string.Empty,
                Address = complaint.Address ?? string.Empty,
                Status = complaint.Status.ToString(),
                Priority = complaint.Priority,
                IsAnonymous = complaint.IsAnonymous,
                CitizenName = complaint.IsAnonymous
                    ? "Anonymous"
                    : FormatCitizenDisplayName(complaint.Citizen?.User),
                CreatedAt = complaint.CreatedAt,
                Images = complaint.ComplaintImages
                    .OrderBy(i => i.ComplaintImageId)
                    .Select(i => i.ImagePath)
                    .Where(p => !string.IsNullOrWhiteSpace(p))
                    .ToList()
            };
        }

        private static string FormatCitizenDisplayName(User? user)
        {
            if (user == null)
            {
                return "—";
            }

            var parts = new[]
            {
                user.FirstName,
                user.MiddleName,
                user.LastName
            }.Where(p => !string.IsNullOrWhiteSpace(p));

            var name = string.Join(" ", parts).Trim();
            return string.IsNullOrEmpty(name) ? "—" : name;
        }


        // =========================================
        // GET COMPLAINT CATEGORIES
        // =========================================

        public async Task<List<object>>
            GetComplaintCategoriesAsync()
        {
            return await _context.ComplaintCategories
                .Where(c => c.IsActive)
                .OrderBy(c => c.CategoryName)
                .Select(c => new
                {
                    c.ComplaintCategoryId,
                    c.CategoryName
                })
                .Cast<object>()
                .ToListAsync();
        }
    }
}