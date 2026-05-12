using CitizenConnect.Application.DTOs.Auth;

namespace CitizenConnect.Application.Interfaces.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto> LoginAsync(LoginRequestDto dto);

        Task<AuthResponseDto> RegisterCitizenAsync(RegisterCitizenDto dto);

        Task<AuthResponseDto> RegisterPoliticianAsync(RegisterPoliticianDto dto);
    }
}