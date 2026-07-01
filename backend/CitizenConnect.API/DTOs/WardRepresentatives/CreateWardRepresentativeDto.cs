namespace CitizenConnect.API.DTOs.WardRepresentatives
{
    public class CreateWardRepresentativeDto
    {
        public int WardId { get; set; } = 1;

        public string RepresentativeName { get; set; }

        public string Designation { get; set; }

        public string MobileNumber { get; set; }

        public string? Email { get; set; }

        public string? Address { get; set; }
    }
}
