using CitizenConnect.API.DTOs.DemographicDto;

namespace CitizenConnect.API.Interfaces.Services
{
    public interface IDemographicService
    {
        Task<ResponseDemographicDto> CreateAsync(CreateDemographicDto dto);

        Task<IEnumerable<ResponseDemographicDto>> GetAllAsync();

        Task<ResponseDemographicDto?> GetByIdAsync(int demographicId);

        Task<bool> UpdateAsync(
            int demographicId,
            UpdateDemographicDto dto);

        Task<bool> DeleteAsync(int demographicId);
    }
}
