    using CitizenConnect.API.Domain.Enums;
    using CitizenConnect.Domain.Entities;
    using CitizenConnect.DTOs.Complaint;
    using CitizenConnect.Infrastructure.Data;
    using CitizenConnect.Interfaces.Services;
    using CitizenConnect.Application.Interfaces.Services;

    using Microsoft.EntityFrameworkCore;

    namespace CitizenConnect.Services
    {
        public class ComplaintService : IComplaintService
        {
            private readonly ApplicationDbContext _context;

            private readonly IWebHostEnvironment _environment;

        private readonly ICloudinaryService _cloudinaryService;

        public ComplaintService(
        ApplicationDbContext context,
        IWebHostEnvironment environment,
        ICloudinaryService cloudinaryService)
    {
        _context = context;

        _environment = environment;

        _cloudinaryService = cloudinaryService;
    }


            // =========================================
            // CREATE COMPLAINT
            // =========================================

            public async Task<ComplaintResponseDto> CreateComplaintAsync(
        CreateComplaintDto dto)
            {
                // =========================================
                // FILE VALIDATION
                // =========================================

                if (dto.Files != null && dto.Files.Any())
                {
                    var allowedTypes =
                        new HashSet<string>(
                            StringComparer.OrdinalIgnoreCase)
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

                // =========================================
                // FIND COMPLAINT CATEGORY
                // =========================================

                var category = await _context
                    .ComplaintCategories
                    .Include(x => x.Department)
                    .FirstOrDefaultAsync(x =>
                        x.ComplaintCategoryId
                        == dto.ComplaintCategoryId);

                if (category == null)
                {
                    throw new Exception(
                        "Complaint category not found.");
                }

            // =========================================
            // FIND AVAILABLE OFFICER
            // =========================================
            // FIND AVAILABLE OFFICER
            // Load balancing based on least assigned complaints

            var officer = await _context.OfficerCategoryMappings

                .Include(x => x.Officer)
                    .ThenInclude(o => o.Complaints)

                .Where(x =>
                    x.ComplaintCategoryId ==
                        dto.ComplaintCategoryId
                    &&
                    x.IsActive
                    &&
                    x.Officer.IsAvailable)

                .OrderBy(x =>
                    x.Officer.Complaints.Count)

                .Select(x => x.Officer)

                .FirstOrDefaultAsync();

            // =========================================
            // GENERATE COMPLAINT NUMBER
            // =========================================

            string complaintNumber =
                    $"CC-{DateTime.UtcNow:yyyyMMddHHmmss}";

                // =========================================
                // CREATE COMPLAINT
                // =========================================

                var complaint = new Complaint
                {
                    ComplaintNumber = complaintNumber,

                    CitizenId = dto.CitizenId,

                    WardId = dto.WardId,

                    ComplaintCategoryId =
                        dto.ComplaintCategoryId,

                    DepartmentId =
                        category.DepartmentId,

                    AssignedOfficerId =
                        officer?.OfficerId,

                    AssignedAt =
                        officer != null
                            ? DateTime.UtcNow
                            : null,

                    Title = dto.Title,

                    Description = dto.Description,

                    Address = dto.Address,

                    Latitude = dto.Latitude,

                    Longitude = dto.Longitude,

                    Priority = dto.Priority,

                    IsAnonymous = dto.IsAnonymous,

                    ComplaintStatusMasterId =
                    officer != null
                    ? 2
                    : 1
                };

            await _context.Complaints
 .AddAsync(complaint);

            await _context.SaveChangesAsync();

            if (officer != null)
            {
               var history =
    new ComplaintStatusHistory
    {
        ComplaintId =
            complaint.ComplaintId,

        OldStatus = "Pending",

        NewStatus = "Assigned",

        Remarks =
            "Complaint auto-assigned to officer."
    };

                await _context
                    .ComplaintStatusHistories
                    .AddAsync(history);

                await _context.SaveChangesAsync();
            }

            // =========================================
            // FILE UPLOAD
            // =========================================

            if (dto.Files != null && dto.Files.Any())
    {
        foreach (var file in dto.Files)
        {
            var imageUrl =
                await _cloudinaryService
                    .UploadImageAsync(file);

            var complaintImage =
                new ComplaintImage
                {
                    ComplaintId =
                        complaint.ComplaintId,

                    ImagePath =
                        imageUrl,

                    FileType =
                        file.ContentType,

                    FileSize =
                        file.Length
                };

            await _context.ComplaintImages
                .AddAsync(complaintImage);
        }

        await _context.SaveChangesAsync();
    }

                // =========================================
                // RETURN RESPONSE
                // =========================================

                return new ComplaintResponseDto
                {
                    ComplaintId =
                        complaint.ComplaintId,

                    ComplaintNumber =
                        complaint.ComplaintNumber,

                    CategoryName =
                        category.CategoryName,

                    Title =
                        complaint.Title,

                    Description =
                        complaint.Description,

                    Address =
                        complaint.Address,

                    Status =
        officer != null
            ? "Assigned"
            : "Pending",

                    Priority =
                        complaint.Priority,

                    CreatedAt =
                        complaint.CreatedAt,

                    DepartmentName =
                        category.Department
                            .DepartmentName,

                    OfficerName =
                        officer != null
                            ? officer.FirstName
                            + " "
                            + officer.LastName
                            : "Not Assigned",

                    OfficerDesignation =
                        officer?.Designation
                        ?? "",

                    OfficerMobileNumber =
                        officer?.MobileNumber
                        ?? "",
                    OfficerEmail =
                        officer?.Email ?? ""
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

                .Include(c => c.AssignedOfficer)

                .Include(c => c.ComplaintStatusMaster)

                .Where(c => c.CitizenId == citizenId)

                .Select(c => new ComplaintResponseDto
                {
                    ComplaintId =
                        c.ComplaintId,

                    ComplaintNumber =
                        c.ComplaintNumber,

                    CategoryName =
                        c.ComplaintCategory.CategoryName,

                    Title =
                        c.Title,

                    Description =
                        c.Description,

                    Address =
                        c.Address,

                    Status =
                        c.ComplaintStatusMaster.StatusName,

                    Priority =
                        c.Priority,

                    CreatedAt =
                        c.CreatedAt,

                    OfficerName =
                        c.AssignedOfficer != null
                            ? c.AssignedOfficer.FirstName
                              + " "
                              + c.AssignedOfficer.LastName
                            : "",

                    OfficerDesignation =
                        c.AssignedOfficer != null
                            ? c.AssignedOfficer.Designation
                            : "",

                    OfficerMobileNumber =
                        c.AssignedOfficer != null
                            ? c.AssignedOfficer.MobileNumber
                            : "",

                    OfficerEmail =
                        c.AssignedOfficer != null
                            ? c.AssignedOfficer.Email
                            : ""
                })

                .OrderByDescending(x => x.CreatedAt)

                .ToListAsync();
        }


        // =========================================
        // GET COMPLAINT DETAILS
        // =========================================

        public async Task<ComplaintDetailsDto?>
        GetComplaintDetailsAsync(int complaintId)
            {
                var complaint =
                    await _context.Complaints

                    .AsNoTracking()

                    .Include(c => c.ComplaintCategory)
    .Include(c => c.Citizen)
        .ThenInclude(cit => cit.User)
    .Include(c => c.ComplaintImages)
    .Include(c => c.ComplaintStatusMaster)

.Include(c => c.AssignedOfficer)
    .Include(c => c.ComplaintStatusHistories)

                    .FirstOrDefaultAsync(c =>

                        c.ComplaintId ==
                        complaintId
                    );

                if (complaint == null)
                {
                    return null;
                }

                return new ComplaintDetailsDto
                {
                    ComplaintId =
                        complaint.ComplaintId,

                    ComplaintNumber =
                        complaint.ComplaintNumber,

                CategoryName =
        complaint.ComplaintCategory != null
            ? complaint.ComplaintCategory.CategoryName
            : "Unknown",

                    Title =
                        complaint.Title,

                    Description =
                        complaint.Description
                        ?? string.Empty,

                    Address =
                        complaint.Address
                        ?? string.Empty,

                Status =
        complaint.ComplaintStatusMaster != null
            ? complaint.ComplaintStatusMaster.StatusName
            : "Pending",

                    Priority =
                        complaint.Priority,

                    IsAnonymous =
                        complaint.IsAnonymous,

                    CitizenName =
        complaint.IsAnonymous
            ? "Anonymous"
            : (complaint.Citizen != null && complaint.Citizen.User != null
                ? FormatCitizenDisplayName(complaint.Citizen.User)
                : "Unknown"),

                    CreatedAt =
                        complaint.CreatedAt,

                Images =
        complaint.ComplaintImages != null
            ? complaint.ComplaintImages
                .OrderBy(i => i.ComplaintImageId)
                .Select(i => i.ImagePath)
                .Where(p => !string.IsNullOrWhiteSpace(p))
                .ToList()
            : new List<string>(),
                    OfficerName =
    complaint.AssignedOfficer != null
    ? complaint.AssignedOfficer.FirstName
      + " "
      + complaint.AssignedOfficer.LastName
    : "",

                    OfficerDesignation =
    complaint.AssignedOfficer?.Designation
    ?? "",

                    OfficerMobileNumber =
    complaint.AssignedOfficer?.MobileNumber
    ?? "",

                    OfficerEmail =
    complaint.AssignedOfficer?.Email
    ?? "",

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