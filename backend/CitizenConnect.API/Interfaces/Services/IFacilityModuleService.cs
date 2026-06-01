using CitizenConnect.Application.DTOs.FacilityModuleDtos;

public interface IFacilityModuleService
{
    Task<FacilityModuleResponseDto> CreateAsync(
        CreateFacilityModuleDto dto);

    Task<IEnumerable<FacilityModuleResponseDto>>
        GetAllAsync();

    Task<FacilityModuleResponseDto?>
        GetByIdAsync(int id);

    Task<bool> UpdateAsync(
        UpdateFacilityModuleDto dto);

    Task<bool> DeleteAsync(int id);
}