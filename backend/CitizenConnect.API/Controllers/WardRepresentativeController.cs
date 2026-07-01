using CitizenConnect.API.DTOs.WardRepresentatives;
using CitizenConnect.API.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CitizenConnect.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WardRepresentativeController : ControllerBase
    {
        private readonly IWardRepresentativeService _wardRepresentativeService;

        public WardRepresentativeController(IWardRepresentativeService wardRepresentativeService)
        {
            _wardRepresentativeService = wardRepresentativeService;
        }

        /// <summary>
        /// Get all representatives
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _wardRepresentativeService.GetAllAsync();
            return Ok(result);
        }

        /// <summary>
        /// Get representative by Id
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _wardRepresentativeService.GetByIdAsync(id);

            if (result == null)
                return NotFound("Representative not found.");

            return Ok(result);
        }

        /// <summary>
        /// Get representatives by Ward Id
        /// </summary>
        [HttpGet("ward/{wardId}")]
        public async Task<IActionResult> GetByWardId(int wardId)
        {
            var result = await _wardRepresentativeService.GetByWardIdAsync(wardId);
            return Ok(result);
        }

        /// <summary>
        /// Create representatives
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create(CreateWardRepresentativesDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _wardRepresentativeService.CreateAsync(dto);

            if (!result)
                return BadRequest("Unable to save representatives.");

            return Ok(new
            {
                Success = true,
                Message = "Ward representatives saved successfully."
            });
        }

        /// <summary>
        /// Update representative
        /// </summary>
        [HttpPut]
        public async Task<IActionResult> Update(UpdateWardRepresentativeDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _wardRepresentativeService.UpdateAsync(dto);

            if (!result)
                return NotFound("Representative not found.");

            return Ok(new
            {
                Success = true,
                Message = "Ward representative updated successfully."
            });
        }

        /// <summary>
        /// Delete representative
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _wardRepresentativeService.DeleteAsync(id);

            if (!result)
                return NotFound("Representative not found.");

            return Ok(new
            {
                Success = true,
                Message = "Ward representative deleted successfully."
            });
        }
    }
}
