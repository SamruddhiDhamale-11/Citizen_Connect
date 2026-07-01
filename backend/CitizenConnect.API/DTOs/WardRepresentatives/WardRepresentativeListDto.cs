namespace CitizenConnect.API.DTOs.WardRepresentatives
{
    public class WardRepresentativeListDto
    {
        public int Id { get; set; }

        public string RepresentativeName { get; set; }

        public string Designation { get; set; }

        public string MobileNumber { get; set; }

        public bool IsActive { get; set; }
    }
}
