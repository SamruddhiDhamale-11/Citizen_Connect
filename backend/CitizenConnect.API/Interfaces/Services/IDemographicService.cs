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

        Task<IEnumerable<ResponseDemographicDto>>
    GetByJurisdictionAsync(int jurisdictionId);

        Task<IEnumerable<ResponseDemographicDto>>
            GetByWardAsync(int wardId);

        Task<IEnumerable<ResponseDemographicDto>>
            GetBySurveyYearAsync(int surveyYear);
    }
}
