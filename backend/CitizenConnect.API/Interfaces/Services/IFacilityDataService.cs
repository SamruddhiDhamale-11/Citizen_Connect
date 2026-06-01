using CitizenConnect.API.DTOs.FacilityDataDto;

namespace CitizenConnect.API.Interfaces.Services
{
    public interface IFacilityDataService
    {
        Task<FacilityDataResponseDto>
            CreateAsync(CreateFacilityDataDto dto);

        Task<bool>
            UpdateAsync(UpdateFacilityDataDto dto);

        Task<bool>
            DeleteAsync(int facilityDataId);

        Task<FacilityDataResponseDto?>
            GetByIdAsync(int facilityDataId);

        Task<IEnumerable<FacilityDataResponseDto>>
            GetAllAsync();

        Task<IEnumerable<FacilityDataResponseDto>>
            GetByJurisdictionAsync(int jurisdictionId);

        Task<IEnumerable<FacilityDataResponseDto>>
            GetByModuleAsync(int facilityModuleId);
    }
}