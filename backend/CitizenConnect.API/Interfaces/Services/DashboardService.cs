using CitizenConnect.API.DTOs.Dashboard;
using CitizenConnect.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CitizenConnect.API.Interfaces.Services
{
    public class DashboardService : IDashboardService
    {

        private readonly ApplicationDbContext _context;

        public DashboardService(
            ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardSummaryDto>
            GetSummaryAsync()
        {
            var totalComplaints =
                await _context.Complaints.CountAsync();

            var resolvedComplaints =
                await _context.Complaints
                .CountAsync(x =>
                    x.ComplaintStatusMaster
                     .StatusName == "Resolved");

            var openComplaints =
    await _context.Complaints
    .CountAsync(x =>
        x.ComplaintStatusMaster.StatusName == "Pending" ||
        x.ComplaintStatusMaster.StatusName == "Assigned" ||
        x.ComplaintStatusMaster.StatusName == "In Progress");

            var assignedComplaints =
                await _context.Complaints
                .CountAsync(x =>
                    x.AssignedOfficerId != null);

            var totalCitizens =
                await _context.Citizens.CountAsync();

            var totalWards =
                await _context.Wards.CountAsync();

            var totalDepartments =
                await _context.Departments.CountAsync();

            var totalSuggestions =
    await _context.Suggestions.CountAsync();

    var totalStaff =
    await _context.Officers.CountAsync();

            decimal resolutionRate = 0;

            if (totalComplaints > 0)
            {
                resolutionRate =
                    Math.Round(
                        (decimal)resolvedComplaints
                        / totalComplaints * 100,
                        2);
            }

           return new DashboardSummaryDto
{
    TotalComplaints = totalComplaints,
    OpenComplaints = openComplaints,
    AssignedComplaints = assignedComplaints,
    ResolvedComplaints = resolvedComplaints,
    TotalCitizens = totalCitizens,
    TotalWards = totalWards,
    TotalDepartments = totalDepartments,
    TotalSuggestions = totalSuggestions,
    TotalStaff = totalStaff,
    ResolutionRate = resolutionRate
};
        }

        public async Task<List<ComplaintCategoryAnalyticsDto>>
            GetCategoryAnalyticsAsync()
        {
            return await _context.Complaints
                .GroupBy(x =>
                    x.ComplaintCategory.CategoryName)
                .Select(x =>
                    new ComplaintCategoryAnalyticsDto
                    {
                        CategoryName = x.Key,
                        TotalComplaints = x.Count()
                    })
                .OrderByDescending(x =>
                    x.TotalComplaints)
                .ToListAsync();
        }

        public async Task<List<WardAnalyticsDto>>
            GetWardAnalyticsAsync()
        {
            return await _context.Wards
                .Select(x =>
                    new WardAnalyticsDto
                    {
                        WardName = x.WardName,

                        TotalComplaints =
                            x.Complaints.Count(),

                        ResolvedComplaints =
                            x.Complaints.Count(c =>
                            c.ComplaintStatusMaster
                             .StatusName == "Resolved")
                    })
                .OrderByDescending(x =>
                    x.TotalComplaints)
                .ToListAsync();
        }

        public async Task<List<MonthlyComplaintTrendDto>>
            GetMonthlyTrendAsync()
        {
            var oneYearAgo =
                DateTime.UtcNow.AddMonths(-12);

            return await _context.Complaints
                .Where(x =>
                    x.CreatedAt >= oneYearAgo)
                .GroupBy(x =>
                    new
                    {
                        x.CreatedAt.Year,
                        x.CreatedAt.Month
                    })
                .Select(x =>
                    new MonthlyComplaintTrendDto
                    {
                        Month =
                            x.Key.Month + "/" +
                            x.Key.Year,

                        TotalComplaints =
                            x.Count()
                    })
                .OrderBy(x =>
                    x.Month)
                .ToListAsync();
        }
    }
}
