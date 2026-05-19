using CitizenConnect.DTOs.Citizen;

namespace CitizenConnect.Interfaces.Services
{
    public interface ICitizenService
    {
        Task<CitizenProfileDto?> GetProfileByUserIdAsync(int userId);
    }
}
