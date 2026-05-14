using CitizenConnect.API.Domain.Enums;
using CitizenConnect.Domain.Common;

namespace CitizenConnect.Domain.Entities
{
    public class Complaint : BaseEntity
    {
        public int ComplaintId { get; set; }

        public string ComplaintNumber { get; set; } = string.Empty;

        public int CitizenId { get; set; }

        public int WardId { get; set; }

        public int ComplaintCategoryId { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

        public decimal Latitude { get; set; }

        public decimal Longitude { get; set; }

        public string Priority { get; set; } = "Medium";

        public ComplaintStatus Status { get; set; }
            = ComplaintStatus.Pending;

        public bool IsAnonymous { get; set; }

        public string? Remarks { get; set; }

        public DateTime? ResolvedAt { get; set; }


        // Navigation Properties

        public Citizen Citizen { get; set; } = null!;

        public Ward Ward { get; set; } = null!;

        public ComplaintCategory ComplaintCategory { get; set; } = null!;

        public ICollection<ComplaintImage> ComplaintImages { get; set; }
            = new List<ComplaintImage>();

        public ICollection<ComplaintStatusHistory>
    ComplaintStatusHistories
        { get; set; }
    = new List<ComplaintStatusHistory>();
    }
}