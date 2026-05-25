using CitizenConnect.Domain.Entities;
using CitizenConnect.DTOs.Admin;
using CitizenConnect.DTOs.Complaint;
using CitizenConnect.Infrastructure.Data;
using CitizenConnect.Interfaces.Services;

using Microsoft.EntityFrameworkCore;

namespace CitizenConnect.Services
{
    public class AdminService : IAdminService
    {
        private readonly ApplicationDbContext _context;

        public AdminService(ApplicationDbContext context)
        {
            _context = context;
        }


        // =========================================
        // GET ALL COMPLAINTS
        // =========================================

        public async Task<List<ComplaintResponseDto>>
            GetAllComplaintsAsync()
        {
            var complaints = await _context.Complaints
                .AsNoTracking()
                .Include(c => c.ComplaintCategory)
                .Include(c => c.Citizen)
                    .ThenInclude(cit => cit.User)
                .Include(c => c.ComplaintImages)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return complaints
                .Select(MapToComplaintResponseDto)
                .ToList();
        }

        private static ComplaintResponseDto MapToComplaintResponseDto(Complaint c)
        {
            var imagePaths = c.ComplaintImages
                .OrderBy(i => i.ComplaintImageId)
                .Select(i => i.ImagePath)
                .Where(p => !string.IsNullOrWhiteSpace(p))
                .ToList();

            return new ComplaintResponseDto
            {
                ComplaintId = c.ComplaintId,
                ComplaintNumber = c.ComplaintNumber,
                CategoryName = c.ComplaintCategory?.CategoryName ?? string.Empty,
                Title = c.Title,
                Description = c.Description ?? string.Empty,
                Address = c.Address ?? string.Empty,
                Status = c.Status.ToString(),
                Priority = c.Priority,
                CitizenName = c.IsAnonymous
                    ? "Anonymous"
                    : FormatCitizenName(c.Citizen?.User),
                ImageUrl = imagePaths.FirstOrDefault() ?? string.Empty,
                Images = imagePaths,
                CreatedAt = c.CreatedAt
            };
        }

        private static string FormatCitizenName(User? user)
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
        // UPDATE COMPLAINT STATUS
        // =========================================

        public async Task<string>
            UpdateComplaintStatusAsync(
                UpdateComplaintStatusDto dto)
        {
            var complaint = await _context.Complaints
                .FirstOrDefaultAsync(c =>
                    c.ComplaintId == dto.ComplaintId);

            if (complaint == null)
            {
                return "Complaint not found";
            }


            // STORE OLD STATUS
            var oldStatus = complaint.Status;


            // UPDATE STATUS
            complaint.Status = dto.NewStatus;

            complaint.Remarks = dto.Remarks;


            // RESOLVED DATE
            if (dto.NewStatus.ToString() == "Resolved")
            {
                complaint.ResolvedAt = DateTime.UtcNow;
            }


            // SAVE STATUS HISTORY
            var history = new ComplaintStatusHistory
            {
                ComplaintId = complaint.ComplaintId,

                OldStatus = oldStatus,

                NewStatus = dto.NewStatus,

                Remarks = dto.Remarks,

                ChangedAt = DateTime.UtcNow
            };

            await _context.ComplaintStatusHistories
                .AddAsync(history);

            await _context.SaveChangesAsync();

            return "Complaint status updated successfully";
        }


        // =========================================
        // GET COMPLAINT HISTORY
        // =========================================

      public async Task<List<ComplaintStatusHistoryDto>>
    GetComplaintHistoryAsync(int complaintId)
{
    return await _context.ComplaintStatusHistories

        .Where(h => h.ComplaintId == complaintId)

        .Select(h => new ComplaintStatusHistoryDto
        {
            OldStatus =
                h.OldStatus.ToString(),

            NewStatus =
                h.NewStatus.ToString(),

            ChangedBy = "Admin",

            Remarks =
                h.Remarks,

            ChangedAt =
                h.ChangedAt
        })

        .OrderByDescending(h => h.ChangedAt)

        .ToListAsync();
}
    }
}