using CitizenConnect.API.DTOs.FacilityRecordDto;

namespace CitizenConnect.API.Interfaces.Services
{
    public interface IFacilityRecordService
    {
        Task<FacilityRecordDto> CreateAsync(
           CreateFacilityRecordDto dto);

        Task<FacilityRecordDto> CreateWithDataAsync(
            CreateFacilityRecordWithDataDto dto);

        Task<FacilityRecordDto?> GetByIdAsync(
            int facilityRecordId);

        Task<IEnumerable<FacilityRecordDto>>
            GetAllAsync();

        Task<IEnumerable<FacilityRecordDto>>
            GetByModuleAsync(
                int facilityModuleId);

        Task<IEnumerable<FacilityRecordDto>>
            GetByJurisdictionAsync(
                int jurisdictionId);

        Task<IEnumerable<FacilityRecordDto>>
            GetByWardAsync(
                int wardId);

        Task<bool> UpdateAsync(
            UpdateFacilityRecordDto dto);

        Task<bool> DeleteAsync(
            int facilityRecordId);
    }
}
