using CitizenConnect.API.Domain.Enums;


namespace CitizenConnect.DTOs.Admin
{
    public class UpdateComplaintStatusDto
    {
        public int ComplaintId { get; set; }

        public int ComplaintStatusMasterId
        { get; set; }

        public string? Remarks { get; set; }
    }
}