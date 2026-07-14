
using CitizenConnect.API.DTOs.LocalityBoundaryDtos;
using CitizenConnect.API.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
namespace CitizenConnect.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocalityBoundaryController : ControllerBase
    {
        private readonly ILocalityBoundaryService _localityBoundaryService;

        public LocalityBoundaryController(
            ILocalityBoundaryService localityBoundaryService)
        {
            _localityBoundaryService = localityBoundaryService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadBoundary(
            [FromBody] UploadLocalityBoundaryDto dto)
        {
            try
            {
                await _localityBoundaryService
                    .UploadBoundaryAsync(dto);

                return Ok(new
                {
                    success = true,
                    message = "Locality boundary uploaded successfully."
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

        [HttpGet("{localityId}")]
        public async Task<IActionResult> GetBoundary(
            int localityId)
        {
            var geoJson =
                await _localityBoundaryService
                    .GetBoundaryGeoJsonAsync(localityId);

            if (string.IsNullOrEmpty(geoJson))
            {
                return NotFound(new
                {
                    success = false,
                    message = "Boundary not found."
                });
            }

            return Content(
                geoJson,
                "application/json");
        }

        [HttpGet("ward/{wardId}")]
        public async Task<IActionResult> GetBoundariesByWard(int wardId)
        {
            try
            {
                var result = await _localityBoundaryService
                    .GetBoundariesByWardAsync(wardId);

                return Ok(result);
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
    }
}