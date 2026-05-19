using CitizenConnect.Application.DTOs.Auth;
using CitizenConnect.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace CitizenConnect.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequestDto dto)
        {
            var result = await _authService.LoginAsync(dto);

            return Ok(result);
        }

        [HttpPost("register-citizen")]
        public async Task<IActionResult> RegisterCitizen(RegisterCitizenDto dto)
        {
            var result = await _authService.RegisterCitizenAsync(dto);

            return Ok(result);
        }

        [HttpPost("register-politician")]
        public async Task<IActionResult> RegisterPolitician([FromForm] RegisterPoliticianDto dto)
        {
            var result = await _authService.RegisterPoliticianAsync(dto);

            return Ok(result);
        }
    }
}