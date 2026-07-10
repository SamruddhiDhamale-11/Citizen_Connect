using CitizenConnect.API.DTOs.LocalityBoundaryDtos;

namespace CitizenConnect.API.Interfaces.Services
{
    public interface ILocalityBoundaryService
    {
        Task UploadBoundaryAsync(UploadLocalityBoundaryDto dto);

        Task<string?> GetBoundaryGeoJsonAsync(int localityId);
        Task<List<LocalityBoundaryResponseDto>>
GetBoundariesByWardAsync(int wardId);
    }
}
