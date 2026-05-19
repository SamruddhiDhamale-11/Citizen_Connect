namespace CitizenConnect.DTOs.Citizen
{
    public class CitizenProfileDto
    {
        public bool Success { get; set; }

        public string? Message { get; set; }

        public int CitizenId { get; set; }

        public int UserId { get; set; }

        public string FirstName { get; set; } = string.Empty;

        public string? MiddleName { get; set; }

        public string LastName { get; set; } = string.Empty;

        public string FullName { get; set; } = string.Empty;

        public string Initials { get; set; } = string.Empty;

        public string MobileNo { get; set; } = string.Empty;

        public string? WhatsappNo { get; set; }

        public string Email { get; set; } = string.Empty;

        public int WardId { get; set; }

        public string WardDisplay { get; set; } = string.Empty;

        public string ResidenceTypeName { get; set; } = string.Empty;

        public DateTime RegisteredAt { get; set; }
    }
}
