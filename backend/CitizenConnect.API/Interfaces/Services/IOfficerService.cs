using CitizenConnect.Application.DTOs.Officer;

namespace CitizenConnect.Application.Interfaces.Services
{
    public interface IOfficerService
    {
        Task<OfficerResponseDto>
            CreateOfficerAsync(
                OfficerRequestDto dto);

        Task<List<OfficerResponseDto>>
            GetAllOfficersAsync();

        Task<OfficerResponseDto?>
            GetOfficerByIdAsync(int officerId);

        Task<bool>
            UpdateOfficerAsync(
                int officerId,
                OfficerRequestDto dto);

        Task<bool>
            DeleteOfficerAsync(int officerId);
    }
}