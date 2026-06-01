using CitizenConnect.API.DTOs.FacilityFieldOptionDto;
using CitizenConnect.API.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace CitizenConnect.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Admin")]
    public class FacilityFieldOptionController : ControllerBase
    {
        private readonly IFacilityFieldOptionService _service;

        public FacilityFieldOptionController(
            IFacilityFieldOptionService service)
        {
            _service = service;
        }

        /// <summary>
        /// Create Facility Field Option
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] CreateFacilityFieldOptionDto dto)
        {
            var result = await _service.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = result.FacilityFieldOptionId },
                result);
        }

        /// <summary>
        /// Get Option By Id
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);

            if (result == null)
            {
                return NotFound(new
                {
                    Message = "Facility Field Option not found."
                });
            }

            return Ok(result);
        }

        /// <summary>
        /// Get All Options By Field Id
        /// </summary>
        [HttpGet("field/{fieldId}")]
        public async Task<IActionResult> GetByFieldId(
            int fieldId)
        {
            var result =
                await _service.GetByFieldIdAsync(fieldId);

            return Ok(result);
        }

        /// <summary>
        /// Update Facility Field Option
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] UpdateFacilityFieldOptionDto dto)
        {
            if (id != dto.FacilityFieldOptionId)
            {
                return BadRequest(new
                {
                    Message = "Id mismatch."
                });
            }

            var updated =
                await _service.UpdateAsync(dto);

            if (!updated)
            {
                return NotFound(new
                {
                    Message = "Facility Field Option not found."
                });
            }

            return Ok(new
            {
                Message =
                    "Facility Field Option updated successfully."
            });
        }

        /// <summary>
        /// Delete Facility Field Option
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(
            int id)
        {
            var deleted =
                await _service.DeleteAsync(id);

            if (!deleted)
            {
                return NotFound(new
                {
                    Message = "Facility Field Option not found."
                });
            }

            return Ok(new
            {
                Message =
                    "Facility Field Option deleted successfully."
            });
        }
    }
}