using CitizenConnect.API.DTOs.WardRepresentatives;

namespace CitizenConnect.API.Interfaces.Services
{
    public interface IWardRepresentativeService
    {
        Task<List<WardRepresentativeDto>> GetAllAsync();

        Task<WardRepresentativeDto?> GetByIdAsync(int id);

        Task<List<WardRepresentativeDto>> GetByWardIdAsync(int wardId);

        Task<bool> CreateAsync(CreateWardRepresentativesDto dto);

        Task<bool> UpdateAsync(UpdateWardRepresentativeDto dto);

        Task<bool> DeleteAsync(int id);
    }
}
