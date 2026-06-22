using CitizenConnect.Application.DTOs.Locality;

namespace CitizenConnect.Application.Interfaces.Services
{
    public interface ILocalityService
    {
        // =====================================
        // CREATE LOCALITY
        // =====================================

        Task<LocalityResponseDto>
            CreateLocalityAsync(
                LocalityRequestDto dto);

        // =====================================
        // GET ALL LOCALITIES
        // =====================================

        Task<List<LocalityResponseDto>>
            GetAllLocalitiesAsync();

        // =====================================
        // GET LOCALITY BY ID
        // =====================================

        Task<LocalityResponseDto?>
            GetLocalityByIdAsync(
                int localityId);

        // =====================================
        // UPDATE LOCALITY
        // =====================================

        Task<bool>
            UpdateLocalityAsync(
                int localityId,
                LocalityRequestDto dto);

        // =====================================
        // DELETE LOCALITY
        // =====================================

        Task<bool>
            DeleteLocalityAsync(
                int localityId);

                Task<List<object>> GetLocalitiesByPincodeAsync(string pincode);
    }
}