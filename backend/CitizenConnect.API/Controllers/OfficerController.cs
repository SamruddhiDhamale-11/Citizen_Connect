using CitizenConnect.Application.DTOs.Officer;
using CitizenConnect.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace CitizenConnect.API.Controllers
{
    [ApiController]

    [Route("api/officers")]
    public class OfficerController
        : ControllerBase
    {
        private readonly IOfficerService
            _officerService;

        public OfficerController(
            IOfficerService officerService)
        {
            _officerService =
                officerService;
        }

        [HttpPost]
        public async Task<IActionResult>
            CreateOfficer(
                OfficerRequestDto dto)
        {
            var result =
                await _officerService
                    .CreateOfficerAsync(dto);

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult>
            GetAllOfficers()
        {
            var result =
                await _officerService
                    .GetAllOfficersAsync();

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult>
            GetOfficerById(int id)
        {
            var result =
                await _officerService
                    .GetOfficerByIdAsync(id);

            if (result == null)
            {
                return NotFound(
                    "Officer not found.");
            }

            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult>
            UpdateOfficer(
                int id,
                OfficerRequestDto dto)
        {
            var updated =
                await _officerService
                    .UpdateOfficerAsync(
                        id,
                        dto);

            if (!updated)
            {
                return NotFound(
                    "Officer not found.");
            }

            return Ok(
                "Officer updated successfully.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult>
            DeleteOfficer(int id)
        {
            var deleted =
                await _officerService
                    .DeleteOfficerAsync(id);

            if (!deleted)
            {
                return NotFound(
                    "Officer not found.");
            }

            return Ok(
                "Officer deleted successfully.");
        }
    }
}