namespace CitizenConnect.Application.DTOs.Auth
{
    public class RegisterCitizenDto
    {
        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string MobileNo { get; set; } = string.Empty;

        public string? Email { get; set; }

        public string Gender { get; set; } = string.Empty;

        public DateTime DateOfBirth { get; set; }

        public int WardId { get; set; }

        public int ResidenceTypeId { get; set; }

        public bool IsVoterRegistered { get; set; }

        public string PreferredLanguage { get; set; } = "EN";

        public string Captcha { get; set; } = string.Empty;
    }
}