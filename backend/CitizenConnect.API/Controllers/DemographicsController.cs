using CitizenConnect.API.DTOs.DemographicDto;
using CitizenConnect.API.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace CitizenConnect.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DemographicsController : ControllerBase
    {
        private readonly IDemographicService _demographicService;

        public DemographicsController(
            IDemographicService demographicService)
        {
            _demographicService = demographicService;
        }

        // ==========================================
        // GET ALL
        // ==========================================

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var demographics =
                await _demographicService.GetAllAsync();

            return Ok(demographics);
        }

        // ==========================================
        // GET BY ID
        // ==========================================

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var demographic =
                await _demographicService.GetByIdAsync(id);

            if (demographic == null)
            {
                return NotFound(
                    $"Demographic with Id {id} not found.");
            }

            return Ok(demographic);
        }

        // ==========================================
        // CREATE
        // ==========================================

        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] CreateDemographicDto dto)
        {
            var demographic =
                await _demographicService.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = demographic.DemographicId },
                demographic);
        }

        // ==========================================
        // UPDATE
        // ==========================================

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] UpdateDemographicDto dto)
        {
            var result =
                await _demographicService
                    .UpdateAsync(id, dto);

            if (!result)
            {
                return NotFound(
                    $"Demographic with Id {id} not found.");
            }

            return Ok(
                new
                {
                    Message =
                        "Demographic updated successfully."
                });
        }

        // ==========================================
        // DELETE
        // ==========================================

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result =
                await _demographicService.DeleteAsync(id);

            if (!result)
            {
                return NotFound(
                    $"Demographic with Id {id} not found.");
            }

            return Ok(
                new
                {
                    Message =
                        "Demographic deleted successfully."
                });
        }

        [HttpGet("jurisdiction/{jurisdictionId}")]
        public async Task<IActionResult>
    GetByJurisdiction(int jurisdictionId)
        {
            var data =
                await _demographicService
                    .GetByJurisdictionAsync(jurisdictionId);

            return Ok(data);
        }

        [HttpGet("ward/{wardId}")]
        public async Task<IActionResult>
    GetByWard(int wardId)
        {
            var data =
                await _demographicService
                    .GetByWardAsync(wardId);

            return Ok(data);
        }

        [HttpGet("year/{surveyYear}")]
        public async Task<IActionResult>
    GetBySurveyYear(int surveyYear)
        {
            var data =
                await _demographicService
                    .GetBySurveyYearAsync(surveyYear);

            return Ok(data);
        }
    }
}