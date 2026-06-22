using CitizenConnect.Domain.Common;

namespace CitizenConnect.Domain.Entities
{
    public class Department : BaseEntity
    {
        public int DepartmentId { get; set; }

        public string DepartmentName { get; set; }
            = string.Empty;

        public string? Description { get; set; }

        // Navigation Properties

        public ICollection<ComplaintCategory>
            ComplaintCategories
        { get; set; }
            = new List<ComplaintCategory>();

        public ICollection<Officer> Officers
        { get; set; }
            = new List<Officer>();
        public ICollection<Complaint> Complaints
        { get; set; }
    = new List<Complaint>();

    public string? IconName { get; set; }

public string? ThemeColor { get; set; }


        public ICollection<WardDepartment> WardDepartments
        { get; set; }
    = new List<WardDepartment>();
    }
}