using CitizenConnect.API.DTOs.Ward;
using CitizenConnect.API.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace CitizenConnect.API.Controllers
{
    [ApiController]
    [Route("api/wards")]
    public class WardController : ControllerBase
    {
        private readonly IWardService _wardService;

        public WardController(
            IWardService wardService)
        {
            _wardService = wardService;
        }

        // ==========================================
        // GET : api/wards
        // Get All Wards
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var wards =
                await _wardService.GetAllAsync();

            return Ok(wards);
        }

        // ==========================================
        // GET : api/wards/5
        // Get Ward By Id
        // ==========================================
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(
            int id)
        {
            var ward =
                await _wardService
                    .GetByIdAsync(id);

            if (ward == null)
            {
                return NotFound(
                    $"Ward with Id {id} not found.");
            }

            return Ok(ward);
        }

        // ==========================================
        // GET : api/wards/dropdown
        // Used for Dropdown Lists
        // ==========================================
        [HttpGet("dropdown")]
        public async Task<IActionResult> GetDropdown()
        {
            var wards =
                await _wardService
                    .GetDropdownAsync();

            return Ok(wards);
        }

        // ==========================================
        // POST : api/wards
        // Create New Ward
        // ==========================================
        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] CreateWardDto dto)
        {
            try
            {
                var result =
                    await _wardService
                        .CreateAsync(dto);

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = result.WardId },
                    result);
            }
            catch (Exception ex)
            {
                return BadRequest(
                    new
                    {
                        Message = ex.Message
                    });
            }
        }

        // ==========================================
        // PUT : api/wards/5
        // Update Ward
        // ==========================================
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] UpdateWardDto dto)
        {
            try
            {
                var updated =
                    await _wardService
                        .UpdateAsync(id, dto);

                if (!updated)
                {
                    return NotFound(
                        $"Ward with Id {id} not found.");
                }

                return Ok(
                    new
                    {
                        Message =
                            "Ward updated successfully."
                    });
            }
            catch (Exception ex)
            {
                return BadRequest(
                    new
                    {
                        Message = ex.Message
                    });
            }
        }

        // ==========================================
        // DELETE : api/wards/5
        // Delete Ward
        // ==========================================
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(
            int id)
        {
            try
            {
                var deleted =
                    await _wardService
                        .DeleteAsync(id);

                if (!deleted)
                {
                    return NotFound(
                        $"Ward with Id {id} not found.");
                }

                return Ok(
                    new
                    {
                        Message =
                            "Ward deleted successfully."
                    });
            }
            catch (Exception ex)
            {
                return BadRequest(
                    new
                    {
                        Message = ex.Message
                    });
            }
        }
    }
}