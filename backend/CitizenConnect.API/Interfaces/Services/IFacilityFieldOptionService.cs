using CitizenConnect.API.DTOs.FacilityFieldOptionDto;

namespace CitizenConnect.API.Interfaces.Services
{
    public interface IFacilityFieldOptionService
    {
        Task<FacilityFieldOptionResponseDto>
            CreateAsync(
                CreateFacilityFieldOptionDto dto);

        Task<bool>
            UpdateAsync(
                UpdateFacilityFieldOptionDto dto);

        Task<bool>
            DeleteAsync(
                int optionId);

        Task<FacilityFieldOptionResponseDto?>
            GetByIdAsync(
                int optionId);

        Task<IEnumerable<FacilityFieldOptionResponseDto>>
            GetByFieldIdAsync(
                int facilityFieldId);
    }
}
