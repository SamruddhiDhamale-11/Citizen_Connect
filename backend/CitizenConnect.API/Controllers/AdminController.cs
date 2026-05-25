using CitizenConnect.DTOs.Admin;
using CitizenConnect.Interfaces.Services;

using Microsoft.AspNetCore.Mvc;

namespace CitizenConnect.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(
            IAdminService adminService)
        {
            _adminService = adminService;
        }


        // =========================================
        // GET ALL COMPLAINTS
        // =========================================

        [HttpGet("complaints")]
        public async Task<IActionResult>
            GetAllComplaints()
        {
            var result =
                await _adminService
                    .GetAllComplaintsAsync();

            return Ok(result);
        }


        // =========================================
        // UPDATE COMPLAINT STATUS
        // =========================================

        [HttpPut("update-status")]
        public async Task<IActionResult>
            UpdateComplaintStatus(
                UpdateComplaintStatusDto dto)
        {
            var result =
                await _adminService
                    .UpdateComplaintStatusAsync(dto);

            return Ok(result);
        }


        // =========================================
        // GET COMPLAINT HISTORY
        // =========================================

        [HttpGet("complaint-history/{complaintId}")]
        public async Task<IActionResult>
            GetComplaintHistory(int complaintId)
        {
            var result =
                await _adminService
                    .GetComplaintHistoryAsync(
                        complaintId);

            return Ok(result);
        }


        //chage the suggession Status.



        [HttpPut(
    "suggestions/{suggestionId}/status")]
        public async Task<IActionResult>
UpdateSuggestionStatus(
    int suggestionId,

    [FromBody]
    UpdateSuggestionStatusDto request)
        {
            var result =
                await _adminService
                .UpdateSuggestionStatusAsync(
                    suggestionId,
                    request);

            return Ok(new
            {
                success = result,

                message =
                    "Suggestion status updated successfully."
            });
        }
    }
}