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
            return await _context.Complaints
                .Include(c => c.ComplaintCategory)
                .Select(c => new ComplaintResponseDto
                {
                    ComplaintId = c.ComplaintId,

                    ComplaintNumber = c.ComplaintNumber,

                    CategoryName =
                        c.ComplaintCategory.CategoryName,

                    Title = c.Title,

                    Status = c.Status.ToString(),

                    Priority = c.Priority,

                    CreatedAt = c.CreatedAt
                })
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
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

                ChangedByUserId = dto.ChangedByUserId,

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
                .Include(h => h.ChangedByUser)
                .Where(h => h.ComplaintId == complaintId)
                .Select(h => new ComplaintStatusHistoryDto
                {
                    OldStatus = h.OldStatus.ToString(),

                    NewStatus = h.NewStatus.ToString(),

                    ChangedBy =
                        h.ChangedByUser.FirstName
                        + " "
                        + h.ChangedByUser.LastName,

                    Remarks = h.Remarks,

                    ChangedAt = h.ChangedAt
                })
                .OrderByDescending(h => h.ChangedAt)
                .ToListAsync();
        }
    }
}