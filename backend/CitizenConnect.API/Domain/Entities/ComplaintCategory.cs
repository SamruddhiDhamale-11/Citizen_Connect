using CitizenConnect.Domain.Common;
using CitizenConnect.Domain.Entities;

public class ComplaintCategory : BaseEntity
{
    public int ComplaintCategoryId { get; set; }

    public string CategoryName { get; set; }
        = string.Empty;

    public string? Description { get; set; }

    // NEW

    public int DepartmentId { get; set; }

    public int SLAHours { get; set; } = 24;

    // Navigation Properties

    public Department Department { get; set; }
        = null!;

    public ICollection<Complaint> Complaints
    { get; set; }
        = new List<Complaint>();

    public ICollection<OfficerCategoryMapping> OfficerCategoryMappings { get; set; }
    = new List<OfficerCategoryMapping>();
}