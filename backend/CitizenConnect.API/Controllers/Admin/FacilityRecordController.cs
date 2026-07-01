using CitizenConnect.API.DTOs.FacilityRecordDto;
using CitizenConnect.API.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace CitizenConnect.API.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/facility-records")]
    //[Authorize(Roles = "Admin")]
    public class FacilityRecordController : ControllerBase
    {
        private readonly IFacilityRecordService _service;

        public FacilityRecordController(
            IFacilityRecordService service)
        {
            _service = service;
        }

        /// <summary>
        /// Create Facility Record
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] CreateFacilityRecordDto dto)
        {
            var result =
                await _service.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = result.FacilityRecordId },
                result);
        }

        /// <summary>
        /// Create Facility Record With Data
        /// </summary>
        [HttpPost("with-data")]
        public async Task<IActionResult> CreateWithData(
            [FromBody]
            CreateFacilityRecordWithDataDto dto)
        {
            var result =
                await _service.CreateWithDataAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = result.FacilityRecordId },
                result);
        }

        /// <summary>
        /// Get All Facility Records
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result =
                await _service.GetAllAsync();

            return Ok(result);
        }

        /// <summary>
        /// Get Facility Record By Id
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
                    Message =
                        "Facility Record not found."
                });
            }

            return Ok(result);
        }

        /// <summary>
        /// Get Records By Module
        /// </summary>
        [HttpGet("module/{moduleId}")]
        public async Task<IActionResult>
            GetByModule(int moduleId)
        {
            var result =
                await _service.GetByModuleAsync(
                    moduleId);

            return Ok(result);
        }

        /// <summary>
        /// Get Records By Jurisdiction
        /// </summary>
        [HttpGet("jurisdiction/{jurisdictionId}")]
        public async Task<IActionResult>
            GetByJurisdiction(
                int jurisdictionId)
        {
            var result =
                await _service
                    .GetByJurisdictionAsync(
                        jurisdictionId);

            return Ok(result);
        }

        /// <summary>
        /// Get Records By Ward
        /// </summary>
        [HttpGet("ward/{wardId}")]
        public async Task<IActionResult>
            GetByWard(int wardId)
        {
            var result =
                await _service
                    .GetByWardAsync(wardId);

            return Ok(result);
        }

        /// <summary>
        /// Update Facility Record
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            [FromBody]
            UpdateFacilityRecordDto dto)
        {
            if (id != dto.FacilityRecordId)
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
                        "Facility Record not found."
                });
            }

            return Ok(new
            {
                Message =
                    "Facility Record updated successfully."
            });
        }

        /// <summary>
        /// Delete Facility Record
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
                        "Facility Record not found."
                });
            }

            return Ok(new
            {
                Message =
                    "Facility Record deleted successfully."
            });
        }

        /// <summary>
        /// Get Facility Record Details
        /// </summary>
        [HttpGet("{id}/details")]
        public async Task<IActionResult> GetDetails(int id)
        {
            var result =
                await _service.GetDetailsAsync(id);

            if (result == null)
            {
                return NotFound(new
                {
                    Message = "Facility Record not found."
                });
            }

            return Ok(result);
        }
    }
}