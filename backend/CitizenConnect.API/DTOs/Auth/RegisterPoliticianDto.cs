namespace CitizenConnect.Application.DTOs.Auth
{
    public class RegisterPoliticianDto
    {
        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string MobileNo { get; set; } = string.Empty;

        public string? Email { get; set; }

        public string PartyName { get; set; } = string.Empty;

        public string PoliticianRole { get; set; } = string.Empty;

        public string GovernmentId { get; set; } = string.Empty;

        public int WardId { get; set; }

        public int JurisdictionTypeId { get; set; }

        public string Captcha { get; set; } = string.Empty;
    }
}