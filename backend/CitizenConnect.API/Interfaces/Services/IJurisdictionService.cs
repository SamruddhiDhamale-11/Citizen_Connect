using CitizenConnect.API.DTOs.JurisdictionDto;

namespace CitizenConnect.API.Interfaces.Services
{
    public interface IJurisdictionService
    {
        Task<JurisdictionResponseDto>
            CreateAsync(CreateJurisdictionDto dto);

        Task<bool>
            UpdateAsync(UpdateJurisdictionDto dto);

        Task<bool>
            DeleteAsync(int jurisdictionId);

        Task<JurisdictionResponseDto?>
            GetByIdAsync(int jurisdictionId);

        Task<IEnumerable<JurisdictionResponseDto>>
            GetAllAsync();
    }
}