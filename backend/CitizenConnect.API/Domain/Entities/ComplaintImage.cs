using CitizenConnect.Domain.Common;

namespace CitizenConnect.Domain.Entities
{
    public class ComplaintImage : BaseEntity
    {
        public int ComplaintImageId { get; set; }

        public int ComplaintId { get; set; }

        public string ImagePath { get; set; } = string.Empty;

        public string? FileType { get; set; }

        public long FileSize { get; set; }


        // Navigation
        public Complaint Complaint { get; set; } = null!;
    }
}