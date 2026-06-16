using CitizenConnect.API.DTOs.Dashboard;

namespace CitizenConnect.API.Interfaces.Services
{
    public interface IDashboardService
    {

        Task<DashboardSummaryDto> GetSummaryAsync();

        Task<List<ComplaintCategoryAnalyticsDto>>
            GetCategoryAnalyticsAsync();

        Task<List<WardAnalyticsDto>>
            GetWardAnalyticsAsync();

        Task<List<MonthlyComplaintTrendDto>>
            GetMonthlyTrendAsync();
    }
}
