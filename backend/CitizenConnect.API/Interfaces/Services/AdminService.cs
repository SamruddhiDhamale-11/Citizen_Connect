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
                .Include(c => c.ComplaintStatusMaster)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return complaints
                .Select(MapToComplaintResponseDto)
                .ToList();
        }

        // =========================================
// GET ALL CITIZENS
// =========================================
public async Task<List<object>> GetAllCitizensAsync()
{
    var citizens = await _context.Citizens
        .Include(c => c.User)
        .ToListAsync();

    return citizens.Select(c => new
    {
        citizenId = c.CitizenId,
        firstName = c.User.FirstName,
        lastName = c.User.LastName,
        email = c.User.Email,
        mobile = c.User.MobileNo,
        wardId = c.WardId,
        createdAt = c.CreatedAt
    }).ToList<object>();
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
                Status =c.ComplaintStatusMaster?.StatusName?? string.Empty,
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
    .FirstOrDefaultAsync(c => c.ComplaintId == dto.ComplaintId);

if (complaint == null)
{
    return "Complaint not found";
}

// STEP 1: validate status FIRST
var statusExists = await _context.ComplaintStatusMasters
    .AnyAsync(x => x.ComplaintStatusMasterId == dto.ComplaintStatusMasterId);

if (!statusExists)
{
    return "Invalid Complaint Status Id";
}

// new stautus
var newStatus =
    await _context.ComplaintStatusMasters
    .Where(x =>
        x.ComplaintStatusMasterId ==
        dto.ComplaintStatusMasterId
    )
    .Select(x => x.StatusName)
    .FirstOrDefaultAsync();


// STEP 2: get old status
var oldStatus = await _context.ComplaintStatusMasters
    .Where(x => x.ComplaintStatusMasterId == complaint.ComplaintStatusMasterId)
    .Select(x => x.StatusName)
    .FirstOrDefaultAsync();

            if (newStatus == "Resolved")
            {
                complaint.ResolvedAt = DateTime.UtcNow;
            }


            // SAVE STATUS HISTORY
            var history = new ComplaintStatusHistory
            {
                ComplaintId = complaint.ComplaintId,

                OldStatus =
    oldStatus ?? string.Empty,

                NewStatus =
    newStatus ?? string.Empty,

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


                    ChangedAt = h.ChangedAt
                })
                .OrderByDescending(h => h.ChangedAt)
                .ToListAsync();
        }


        public async Task<bool>
            UpdateSuggestionStatusAsync(
                int suggestionId,
                UpdateSuggestionStatusDto request)
        {
            var suggestion =
                await _context.Suggestions

                .Include(x => x.SuggestionStatusMaster)

                .FirstOrDefaultAsync(x =>

                    x.SuggestionId ==
                    suggestionId);

            if (suggestion == null)
            {
                throw new Exception(
                    "Suggestion not found.");
            }

            /**
             * =====================================
             * STORE OLD STATUS NAME
             * =====================================
             */

            var oldStatus =
                suggestion
                    .SuggestionStatusMaster
                    .StatusName;


            /**
             * =====================================
             * UPDATE STATUS
             * =====================================
             */

            suggestion.SuggestionStatusMasterId =
                request.SuggestionStatusMasterId;

            suggestion.AdminRemarks =
                request.Remarks;

            suggestion.ReviewedAt =
                DateTime.UtcNow;


            /**
             * =====================================
             * GET NEW STATUS NAME
             * =====================================
             */

            var newStatus =
                await _context
                .SuggestionStatusMasters

                .Where(x =>

                    x.SuggestionStatusMasterId ==
                    request.SuggestionStatusMasterId
                )

                .Select(x => x.StatusName)

                .FirstOrDefaultAsync();


            /**
             * =====================================
             * SAVE HISTORY
             * =====================================
             */

            var history =
                new SuggestionStatusHistory
                {
                    SuggestionId =
                        suggestion.SuggestionId,

                    OldStatus =
                        oldStatus,

                    NewStatus =
                        newStatus ?? string.Empty,

                    Remarks =
                        request.Remarks,

                    ChangedAt =
                        DateTime.UtcNow
                };

            _context
                .SuggestionStatusHistories
                .Add(history);

            await _context.SaveChangesAsync();

            return true;
        }
        /*    Task<string> IAdminService.UpdateComplaintStatusAsync(UpdateComplaintStatusDto dto)
            {
                throw new NotImplementedException();
            }

            Task<List<ComplaintStatusHistoryDto>> IAdminService.GetComplaintHistoryAsync(int complaintId)
            {
                throw new NotImplementedException();
            }

            Task<bool> IAdminService.UpdateSuggestionStatusAsync(int suggestionId, UpdateSuggestionStatusDto request)
            {
                throw new NotImplementedException();


            }
          */

          public async Task<List<ComplaintStatusDto>> GetComplaintStatusesAsync()
{
    return await _context.ComplaintStatusMasters
        .Where(x => x.IsActive)
        .OrderBy(x => x.DisplayOrder)
        .Select(x => new ComplaintStatusDto
        {
            ComplaintStatusMasterId = x.ComplaintStatusMasterId,
            StatusName = x.StatusName
        })
        .ToListAsync();
}
    }
}
            
