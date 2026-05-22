namespace CitizenConnect.Application.DTOs.Officer
{
    public class OfficerResponseDto
    {
        public int OfficerId { get; set; }

        public string FullName { get; set; }
            = string.Empty;

        public string Email { get; set; }
            = string.Empty;

        public string MobileNumber { get; set; }
            = string.Empty;

        public string Designation { get; set; }
            = string.Empty;

        public int DepartmentId { get; set; }

        public string DepartmentName { get; set; }
            = string.Empty;

        public bool IsAvailable { get; set; }
    }
}