using CitizenConnect.Domain.Common;

namespace CitizenConnect.Domain.Entities
{
    public class ComplaintStatusMaster : BaseEntity
    {
        public int ComplaintStatusMasterId
        { get; set; }

        public string StatusName
        { get; set; }
            = string.Empty;

        public string? Description
        { get; set; }

        public int DisplayOrder
        { get; set; }

        // Navigation

        public ICollection<Complaint> Complaints
        { get; set; }
            = new List<Complaint>();
    }
}