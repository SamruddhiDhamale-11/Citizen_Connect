using CitizenConnect.DTOs.Admin;
using CitizenConnect.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace CitizenConnect.Controllers
{
    /// <summary>
    /// AdminController handles all admin operations
    /// such as managing citizens, complaints, and suggestions.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        /// <summary>
        /// Constructor - Injects Admin Service dependency
        /// </summary>
        public AdminController(
            IAdminService adminService)
        {
            _adminService = adminService;
        }

        // =====================================================
        // CITIZEN MANAGEMENT
        // =====================================================

        /// <summary>
        /// Get all citizens for Admin Dashboard
        /// </summary>
        [HttpGet("citizens")]
        public async Task<IActionResult> GetAllCitizens()
        {
            var result = await _adminService.GetAllCitizensAsync();

            return Ok(new
            {
                success = true,
                data = result
            });
        }

        // =====================================================
        // COMPLAINT MANAGEMENT
        // =====================================================

        /// <summary>
        /// Get all complaints
        /// </summary>
        [HttpGet("complaints")]
        public async Task<IActionResult>
            GetAllComplaints()
        {
            var result =
                await _adminService
                    .GetAllComplaintsAsync();

            return Ok(result);
        }

        // =====================================================
        // COMPLAINT STATUS UPDATE
        // =====================================================

        /// <summary>
        /// Update complaint status (Pending / InProgress / Resolved)
        /// </summary>
        [HttpPut("update-status")]
        public async Task<IActionResult>
            UpdateComplaintStatus(
                [FromBody] UpdateComplaintStatusDto dto)
        {
            var result =
                await _adminService
                    .UpdateComplaintStatusAsync(dto);

            return Ok(result);
        }

        // =====================================================
        // COMPLAINT HISTORY
        // =====================================================

        /// <summary>
        /// Get complaint status history for tracking changes
        /// </summary>
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

        // =====================================================
        // SUGGESTION MANAGEMENT
        // =====================================================

        /// <summary>
        /// Update suggestion status (Reviewed / Approved / Rejected)
        /// </summary>
        [HttpPut("suggestions/{suggestionId}/status")]
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