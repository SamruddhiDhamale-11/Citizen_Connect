using CitizenConnect.API.DTOs.FacilityDataDto;
using CitizenConnect.API.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace CitizenConnect.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Admin")]
    public class FacilityDataController : ControllerBase
    {
        private readonly IFacilityDataService _service;

        public FacilityDataController(
            IFacilityDataService service)
        {
            _service = service;
        }

        /// <summary>
        /// Create Facility Data
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] CreateFacilityDataDto dto)
        {
            var result =
                await _service.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = result.FacilityDataId },
                result);
        }

        /// <summary>
        /// Get All Facility Data
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result =
                await _service.GetAllAsync();

            return Ok(result);
        }

        /// <summary>
        /// Get Facility Data By Id
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
                    Message = "Facility Data not found."
                });
            }

            return Ok(result);
        }

        /// <summary>
        /// Get Facility Data By Jurisdiction
        /// </summary>
        [HttpGet("jurisdiction/{jurisdictionId}")]
        public async Task<IActionResult>
            GetByJurisdiction(int jurisdictionId)
        {
            var result =
                await _service
                    .GetByJurisdictionAsync(
                        jurisdictionId);

            return Ok(result);
        }

        /// <summary>
        /// Get Facility Data By Module
        /// </summary>
        [HttpGet("module/{moduleId}")]
        public async Task<IActionResult>
            GetByModule(int moduleId)
        {
            var result =
                await _service
                    .GetByModuleAsync(
                        moduleId);

            return Ok(result);
        }

        /// <summary>
        /// Update Facility Data
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] UpdateFacilityDataDto dto)
        {
            if (id != dto.FacilityDataId)
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
                    Message =
                        "Facility Data not found."
                });
            }

            return Ok(new
            {
                Message =
                    "Facility Data updated successfully."
            });
        }

        /// <summary>
        /// Delete Facility Data
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
                    Message =
                        "Facility Data not found."
                });
            }

            return Ok(new
            {
                Message =
                    "Facility Data deleted successfully."
            });
        }
    }
}