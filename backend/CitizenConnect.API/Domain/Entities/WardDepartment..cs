namespace CitizenConnect.Domain.Entities
{
    public class WardDepartment
    {
        public int WardDepartmentId { get; set; }

        public int WardId { get; set; }

        public int DepartmentId { get; set; }

        public DateTime AssignedAt { get; set; }
            = DateTime.UtcNow;

        // Navigation

        public Ward Ward { get; set; } = null!;

        public Department Department { get; set; } = null!;
    }
}