using CitizenConnect.Domain.Common;

namespace CitizenConnect.Domain.Entities
{
    public class ComplaintCategory : BaseEntity
    {
        public int ComplaintCategoryId { get; set; }

        public string CategoryName { get; set; } = string.Empty;

        public string? Description { get; set; }


        // Navigation Property
        public ICollection<Complaint> Complaints { get; set; }
            = new List<Complaint>();
    }
}