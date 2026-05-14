using CitizenConnect.API.Domain.Enums;


namespace CitizenConnect.DTOs.Admin
{
    public class UpdateComplaintStatusDto
    {
        public int ComplaintId { get; set; }

        public ComplaintStatus NewStatus { get; set; }

        public int ChangedByUserId { get; set; }

        public string? Remarks { get; set; }
    }
}