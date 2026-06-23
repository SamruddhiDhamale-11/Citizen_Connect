using CitizenConnect.API.DTOs.WardBoundary;
using CitizenConnect.API.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace CitizenConnect.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WardBoundaryController : ControllerBase
    {
        private readonly IWardBoundaryService _wardBoundaryService;

        public WardBoundaryController(
            IWardBoundaryService wardBoundaryService)
        {
            _wardBoundaryService = wardBoundaryService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadBoundary(
            [FromBody] UploadWardBoundaryDto dto)
        {
            try
            {
                await _wardBoundaryService
                    .UploadBoundaryAsync(dto);

                return Ok(new
                {
                    success = true,
                    message = "Ward boundary uploaded successfully."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        [HttpGet("{wardId}")]
        public async Task<IActionResult>
    GetBoundary(int wardId)
        {
            var geoJson =
                await _wardBoundaryService
                    .GetBoundaryGeoJsonAsync(
                        wardId);

            if (string.IsNullOrEmpty(geoJson))
            {
                return NotFound(
                    "Boundary not found.");
            }

            return Content(
                geoJson,
                "application/json");
        }
    }
}