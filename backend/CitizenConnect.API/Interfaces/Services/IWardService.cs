using CitizenConnect.API.DTOs.Ward;

namespace CitizenConnect.API.Interfaces.Services
{
    public interface IWardService
    {
        Task<List<WardResponseDto>> GetAllAsync();

        Task<WardResponseDto?> GetByIdAsync(int wardId);

        Task<WardResponseDto> CreateAsync(
            CreateWardDto dto);

        Task<bool> UpdateAsync(
            int wardId,
            UpdateWardDto dto);

        Task<bool> DeleteAsync(
            int wardId);

        Task<List<WardDropdownDto>>
    GetDropdownAsync();
    }
}
