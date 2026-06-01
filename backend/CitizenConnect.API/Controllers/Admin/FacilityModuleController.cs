using CitizenConnect.Application.DTOs.FacilityModuleDtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CitizenConnect.API.Controllers.Admin
{
    [Route("api/admin/facility-modules")]
    [ApiController]
  //  [Authorize(Roles = "Admin")]
    public class FacilityModuleController : ControllerBase
    {
        private readonly IFacilityModuleService _service;

        public FacilityModuleController(
            IFacilityModuleService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create(
            CreateFacilityModuleDto dto)
        {
            var result =
                await _service.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = result.FacilityModuleId },
                result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result =
                await _service.GetAllAsync();

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(
            int id)
        {
            var result =
                await _service.GetByIdAsync(id);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            UpdateFacilityModuleDto dto)
        {
            if (id != dto.FacilityModuleId)
                return BadRequest(
                    "Id mismatch.");

            var updated =
                await _service.UpdateAsync(dto);

            if (!updated)
                return NotFound();

            return Ok(new
            {
                Message =
                    "Facility Module updated successfully."
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(
            int id)
        {
            var deleted =
                await _service.DeleteAsync(id);

            if (!deleted)
                return NotFound();

            return Ok(new
            {
                Message =
                    "Facility Module deleted successfully."
            });
        }
    }
}