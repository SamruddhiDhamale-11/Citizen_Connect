namespace CitizenConnect.API.DTOs.Department
{
    public class DepartmentResponseDto
    {
        public int DepartmentId { get; set; }

        public string DepartmentName { get; set; }
            = string.Empty;

        public string? Description { get; set; }
    }
}
