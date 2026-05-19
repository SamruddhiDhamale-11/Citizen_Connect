using CitizenConnect.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace CitizenConnect.Controllers
{
    [ApiController]
    [Route("api/citizen")]
    public class CitizenController : ControllerBase
    {
        private readonly ICitizenService _citizenService;

        public CitizenController(ICitizenService citizenService)
        {
            _citizenService = citizenService;
        }

        [HttpGet("profile/{userId:int}")]
        public async Task<IActionResult> GetProfile(int userId)
        {
            var profile = await _citizenService.GetProfileByUserIdAsync(userId);

            if (profile == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Citizen profile not found."
                });
            }

            return Ok(profile);
        }
    }
}
