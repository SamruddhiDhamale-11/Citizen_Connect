using CitizenConnect.DTOs.Admin;
using CitizenConnect.DTOs.Complaint;

namespace CitizenConnect.Interfaces.Services
{
    public interface IAdminService
{
    Task<List<ComplaintResponseDto>> GetAllComplaintsAsync();

    Task<List<object>> GetAllCitizensAsync();

    Task<string> UpdateComplaintStatusAsync(UpdateComplaintStatusDto dto);

    Task<List<ComplaintStatusHistoryDto>> GetComplaintHistoryAsync(int complaintId);

    Task<bool> UpdateSuggestionStatusAsync(int suggestionId, UpdateSuggestionStatusDto request);
}
}