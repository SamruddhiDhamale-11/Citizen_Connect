namespace CitizenConnect.API.DTOs.Department
{
    public class DepartmentRequestDto
    {
        public string DepartmentName { get; set; }
            = string.Empty;

        public string? Description { get; set; }

        public string? IconName { get; set; }

public string? ThemeColor { get; set; }
    }
}
