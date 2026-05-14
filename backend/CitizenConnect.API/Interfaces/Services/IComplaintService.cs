using CitizenConnect.DTOs.Complaint;

namespace CitizenConnect.Interfaces.Services
{
    public interface IComplaintService
    {
        Task<ComplaintResponseDto> CreateComplaintAsync(
            CreateComplaintDto dto);

        Task<List<ComplaintResponseDto>> GetCitizenComplaintsAsync(
            int citizenId);

        Task<ComplaintDetailsDto?> GetComplaintDetailsAsync(
            int complaintId);

        Task<List<object>> GetComplaintCategoriesAsync();
    }
}