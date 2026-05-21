using CitizenConnect.Application.DTOs.Locality;
using CitizenConnect.Application.Interfaces.Services;

using Microsoft.AspNetCore.Mvc;

namespace CitizenConnect.API.Controllers
{
    [ApiController]

    [Route("api/localities")]
    public class LocalityController
        : ControllerBase
    {
        private readonly ILocalityService
            _localityService;

        public LocalityController(
            ILocalityService localityService)
        {
            _localityService =
                localityService;
        }

        // =====================================
        // CREATE LOCALITY
        // =====================================

        [HttpPost]
        public async Task<IActionResult>
            CreateLocality(
                LocalityRequestDto dto)
        {
            var result =
                await _localityService
                    .CreateLocalityAsync(dto);

            return Ok(result);
        }

        // =====================================
        // GET ALL LOCALITIES
        // =====================================

        [HttpGet]
        public async Task<IActionResult>
            GetAllLocalities()
        {
            var result =
                await _localityService
                    .GetAllLocalitiesAsync();

            return Ok(result);
        }

        // =====================================
        // GET LOCALITY BY ID
        // =====================================

        [HttpGet("{id}")]
        public async Task<IActionResult>
            GetLocalityById(int id)
        {
            var result =
                await _localityService
                    .GetLocalityByIdAsync(id);

            if (result == null)
            {
                return NotFound(
                    "Locality not found.");
            }

            return Ok(result);
        }

        // =====================================
        // UPDATE LOCALITY
        // =====================================

        [HttpPut("{id}")]
        public async Task<IActionResult>
            UpdateLocality(
                int id,
                LocalityRequestDto dto)
        {
            var updated =
                await _localityService
                    .UpdateLocalityAsync(
                        id,
                        dto);

            if (!updated)
            {
                return NotFound(
                    "Locality not found.");
            }

            return Ok(
                "Locality updated successfully.");
        }

        // =====================================
        // DELETE LOCALITY
        // =====================================

        [HttpDelete("{id}")]
        public async Task<IActionResult>
            DeleteLocality(int id)
        {
            var deleted =
                await _localityService
                    .DeleteLocalityAsync(id);

            if (!deleted)
            {
                return NotFound(
                    "Locality not found.");
            }

            return Ok(
                "Locality deleted successfully.");
        }
    }
}