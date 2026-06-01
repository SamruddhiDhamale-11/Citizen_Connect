using CitizenConnect.Application.DTOs.Facility;
using CitizenConnect.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CitizenConnect.API.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/facility-fields")]
    //[Authorize(Roles = "Admin")]
    public class FacilityFieldController : ControllerBase
    {
        private readonly IFacilityFieldService _facilityFieldService;

        public FacilityFieldController(
            IFacilityFieldService facilityFieldService)
        {
            _facilityFieldService = facilityFieldService;
        }

        /// <summary>
        /// Create Facility Field
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateField(
            [FromBody] CreateFacilityFieldDto dto)
        {
            var result =
                await _facilityFieldService.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetFieldById),
                new { id = result.FacilityFieldId },
                result);
        }

        /// <summary>
        /// Get Field By Id
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFieldById(
            int id)
        {
            var result =
                await _facilityFieldService.GetByIdAsync(id);

            if (result == null)
            {
                return NotFound(new
                {
                    Message = "Facility Field not found."
                });
            }

            return Ok(result);
        }

        /// <summary>
        /// Get All Fields By Module
        /// </summary>
        [HttpGet("module/{moduleId}")]
        public async Task<IActionResult> GetFieldsByModule(
            int moduleId)
        {
            var result =
                await _facilityFieldService
                    .GetByModuleIdAsync(moduleId);

            return Ok(result);
        }

        /// <summary>
        /// Update Facility Field
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateField(
            int id,
            [FromBody] UpdateFacilityFieldDto dto)
        {
            if (id != dto.FacilityFieldId)
            {
                return BadRequest(new
                {
                    Message = "Id mismatch."
                });
            }

            var updated =
                await _facilityFieldService
                    .UpdateAsync(dto);

            if (!updated)
            {
                return NotFound(new
                {
                    Message = "Facility Field not found."
                });
            }

            return Ok(new
            {
                Message =
                    "Facility Field updated successfully."
            });
        }

        /// <summary>
        /// Delete Facility Field
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteField(
            int id)
        {
            var deleted =
                await _facilityFieldService
                    .DeleteAsync(id);

            if (!deleted)
            {
                return NotFound(new
                {
                    Message = "Facility Field not found."
                });
            }

            return Ok(new
            {
                Message =
                    "Facility Field deleted successfully."
            });
        }
    }
}