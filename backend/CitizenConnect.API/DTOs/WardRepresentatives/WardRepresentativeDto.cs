namespace CitizenConnect.API.DTOs.WardRepresentatives
{
    public class WardRepresentativeDto
    {
        public int Id { get; set; }

        public int WardId { get; set; }

        public string RepresentativeName { get; set; }

        public string Designation { get; set; }

        public string MobileNumber { get; set; }

        public string? Email { get; set; }

        public string? Address { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}
