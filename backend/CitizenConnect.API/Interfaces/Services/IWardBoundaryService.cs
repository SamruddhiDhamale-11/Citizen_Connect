using CitizenConnect.API.DTOs.WardBoundary;

namespace CitizenConnect.API.Interfaces.Services
{
    public interface IWardBoundaryService
    {
        Task UploadBoundaryAsync(
            UploadWardBoundaryDto dto);

        Task<string?> GetBoundaryGeoJsonAsync(
    int wardId);
    }
}
