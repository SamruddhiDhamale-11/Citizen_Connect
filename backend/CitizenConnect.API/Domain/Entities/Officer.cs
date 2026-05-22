using CitizenConnect.Domain.Common;

namespace CitizenConnect.Domain.Entities
{
    public class Officer : BaseEntity
    {
        public int OfficerId { get; set; }

        public string FirstName { get; set; }
            = string.Empty;

        public string LastName { get; set; }
            = string.Empty;

        public string Email { get; set; }
            = string.Empty;

        public string MobileNumber { get; set; }
            = string.Empty;

        public string Designation { get; set; }
            = string.Empty;

        public int DepartmentId { get; set; }

        public bool IsAvailable { get; set; }
            = true;

        // Navigation Properties

        public Department Department { get; set; }
            = null!;

        public ICollection<Complaint> Complaints
        { get; set; }
            = new List<Complaint>();
    }
}