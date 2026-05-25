using CitizenConnect.API.Domain.Enums;
using CitizenConnect.Domain.Common;

namespace CitizenConnect.Domain.Entities
{
    public class ComplaintStatusHistory : BaseEntity
    {
        public int ComplaintStatusHistoryId { get; set; }

        public int ComplaintId { get; set; }

        public ComplaintStatus OldStatus { get; set; }

        public ComplaintStatus NewStatus { get; set; }

        public string? Remarks { get; set; }

        public DateTime ChangedAt { get; set; }
            = DateTime.UtcNow;


        // Navigation Properties

        public Complaint Complaint { get; set; } = null!;
    }
}