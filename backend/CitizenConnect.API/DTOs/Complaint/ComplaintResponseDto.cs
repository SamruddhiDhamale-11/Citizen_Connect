namespace CitizenConnect.DTOs.Complaint
{
    public class ComplaintResponseDto
    {
        public int ComplaintId { get; set; }

        public string ComplaintNumber { get; set; } = string.Empty;

        public string CategoryName { get; set; } = string.Empty;

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

        public string Status { get; set; } = string.Empty;

        public string Priority { get; set; } = string.Empty;

        public string CitizenName { get; set; } = string.Empty;

        public string ImageUrl { get; set; } = string.Empty;

        public List<string> Images { get; set; } = new List<string>();

        public DateTime CreatedAt { get; set; }

        // add this fields for auto-assign complaint to department
        public string DepartmentName { get; set; }
            = string.Empty;

        public string OfficerName { get; set; }
            = string.Empty;

        public string OfficerDesignation { get; set; }
            = string.Empty;

        public string OfficerMobileNumber { get; set; }
            = string.Empty;

        public int SLAHours { get; set; }

        public DateTime? ExpectedResolutionTime
        { get; set; }
    }
}