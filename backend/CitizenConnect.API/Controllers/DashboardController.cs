using CitizenConnect.API.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CitizenConnect.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly
        IDashboardService _dashboardService;

        public DashboardController(
            IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("summary")]
        public async Task<IActionResult>
            GetSummary()
        {
            return Ok(
                await _dashboardService
                    .GetSummaryAsync());
        }

        [HttpGet("categories")]
        public async Task<IActionResult>
            GetCategories()
        {
            return Ok(
                await _dashboardService
                    .GetCategoryAnalyticsAsync());
        }

        [HttpGet("wards")]
        public async Task<IActionResult>
            GetWards()
        {
            return Ok(
                await _dashboardService
                    .GetWardAnalyticsAsync());
        }

        [HttpGet("monthly-trend")]
        public async Task<IActionResult>
            GetMonthlyTrend()
        {
            return Ok(
                await _dashboardService
                    .GetMonthlyTrendAsync());
        }
    }
}
