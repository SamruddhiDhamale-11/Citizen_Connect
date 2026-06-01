using CitizenConnect.API.DTOs.JurisdictionDto;
using CitizenConnect.API.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace CitizenConnect.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Admin")]
    public class JurisdictionController : ControllerBase
    {
        private readonly IJurisdictionService _service;

        public JurisdictionController(
            IJurisdictionService service)
        {
            _service = service;
        }

        /// <summary>
        /// Create Jurisdiction
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] CreateJurisdictionDto dto)
        {
            var result =
                await _service.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = result.JurisdictionId },
                result);
        }

        /// <summary>
        /// Get All Jurisdictions
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result =
                await _service.GetAllAsync();

            return Ok(result);
        }

        /// <summary>
        /// Get Jurisdiction By Id
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(
            int id)
        {
            var result =
                await _service.GetByIdAsync(id);

            if (result == null)
            {
                return NotFound(new
                {
                    Message = "Jurisdiction not found."
                });
            }

            return Ok(result);
        }

        /// <summary>
        /// Update Jurisdiction
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] UpdateJurisdictionDto dto)
        {
            if (id != dto.JurisdictionId)
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
                    Message = "Jurisdiction not found."
                });
            }

            return Ok(new
            {
                Message =
                    "Jurisdiction updated successfully."
            });
        }

        /// <summary>
        /// Delete Jurisdiction
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
                    Message = "Jurisdiction not found."
                });
            }

            return Ok(new
            {
                Message =
                    "Jurisdiction deleted successfully."
            });
        }
    }
}