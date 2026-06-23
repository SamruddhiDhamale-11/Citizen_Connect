namespace CitizenConnect.Application.DTOs.Officer
{
    public class OfficerRequestDto
    {
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

        public int CategoryId { get; set; }


        public int WardId { get; set; }


        public bool IsAvailable { get; set; }
            = true;
    }
}