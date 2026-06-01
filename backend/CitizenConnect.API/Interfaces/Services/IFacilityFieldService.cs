using CitizenConnect.Application.DTOs.Facility;

namespace CitizenConnect.Application.Services.Interfaces
{
    public interface IFacilityFieldService
    {
        Task<FacilityFieldResponseDto> CreateAsync(
            CreateFacilityFieldDto dto);

        Task<bool> UpdateAsync(
            UpdateFacilityFieldDto dto);

        Task<bool> DeleteAsync(
            int facilityFieldId);

        Task<FacilityFieldResponseDto?>
            GetByIdAsync(int facilityFieldId);

        Task<IEnumerable<FacilityFieldResponseDto>>
            GetByModuleIdAsync(int facilityModuleId);
    }
}