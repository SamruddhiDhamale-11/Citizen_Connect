using Microsoft.AspNetCore.Http;

namespace CitizenConnect.Application.DTOs.Auth
{
    public class RegisterPoliticianDto
    {
        // ---- User fields ----
        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string MobileNo { get; set; } = string.Empty;

        public string? Email { get; set; }

        // ---- Politician fields ----
        public string PartyName { get; set; } = string.Empty;

        public string PoliticianRole { get; set; } = string.Empty;

        public int Age { get; set; }

        public string Gender { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

        public string GovernmentId { get; set; } = string.Empty;

        public string WardNumber { get; set; } = string.Empty;

        public string WardName { get; set; } = string.Empty;

        public string PartName { get; set; } = string.Empty;

        // WardId is optional — the ward dropdown was removed from the
        // politician registration form. Politicians identify their ward
        // via WardNumber and WardName text fields instead.
        public int? WardId { get; set; }

        public int JurisdictionTypeId { get; set; }

        // ---- File uploads ----
        public IFormFile? ProfilePhoto { get; set; }

        public IFormFile? IdProof { get; set; }

        // ---- Auth ----
        public string Password { get; set; } = string.Empty;

        public string Captcha { get; set; } = string.Empty;
    }
}
