using CitizenConnect.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using CitizenConnect.DTOs.Citizen;

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

        [HttpPut("profile/{citizenId:int}")]
public async Task<IActionResult> UpdateProfile(
    int citizenId,
    [FromBody] UpdateCitizenProfileDto dto)
{
    var result =
        await _citizenService
            .UpdateProfileAsync(
                citizenId,
                dto);

    if (!result)
    {
        return NotFound(new
        {
            success = false,
            message = "Citizen not found."
        });
    }

    return Ok(new
    {
        success = true,
        message = "Profile updated successfully."
    });
}
    }
}
