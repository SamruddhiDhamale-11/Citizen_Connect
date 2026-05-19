using CitizenConnect.DTOs.Complaint;
using CitizenConnect.Interfaces.Services;

using Microsoft.AspNetCore.Mvc;

namespace CitizenConnect.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ComplaintController : ControllerBase
    {
        private readonly IComplaintService _complaintService;

        public ComplaintController(
            IComplaintService complaintService)
        {
            _complaintService = complaintService;
        }


        // =========================================
        // CREATE COMPLAINT
        // =========================================

        [HttpPost("create")]
        public async Task<IActionResult> CreateComplaint(
            [FromForm] CreateComplaintDto dto)
        {
            try
            {
                var result =
                    await _complaintService
                        .CreateComplaintAsync(dto);

                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }


        // =========================================
        // GET CITIZEN COMPLAINTS
        // =========================================

        [HttpGet("citizen/{citizenId}")]
        public async Task<IActionResult>
            GetCitizenComplaints(int citizenId)
        {
            var result =
                await _complaintService
                    .GetCitizenComplaintsAsync(citizenId);

            return Ok(result);
        }


        // =========================================
        // GET COMPLAINT DETAILS
        // =========================================

        [HttpGet("{complaintId}")]
        public async Task<IActionResult>
            GetComplaintDetails(int complaintId)
        {
            var result =
                await _complaintService
                    .GetComplaintDetailsAsync(complaintId);

            if (result == null)
            {
                return NotFound(
                    "Complaint not found");
            }

            return Ok(result);
        }


        // =========================================
        // GET COMPLAINT CATEGORIES
        // =========================================

        [HttpGet("categories")]
        public async Task<IActionResult>
            GetComplaintCategories()
        {
            var result =
                await _complaintService
                    .GetComplaintCategoriesAsync();

            return Ok(result);
        }
    }
}