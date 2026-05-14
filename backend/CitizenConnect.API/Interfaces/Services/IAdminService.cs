using CitizenConnect.DTOs.Admin;
using CitizenConnect.DTOs.Complaint;

namespace CitizenConnect.Interfaces.Services
{
    public interface IAdminService
    {
        // =========================================
        // ALL COMPLAINTS
        // =========================================

        Task<List<ComplaintResponseDto>>
            GetAllComplaintsAsync();


        // =========================================
        // UPDATE COMPLAINT STATUS
        // =========================================

        Task<string> UpdateComplaintStatusAsync(
            UpdateComplaintStatusDto dto);


        // =========================================
        // COMPLAINT HISTORY
        // =========================================

        Task<List<ComplaintStatusHistoryDto>>
            GetComplaintHistoryAsync(int complaintId);
    }
}