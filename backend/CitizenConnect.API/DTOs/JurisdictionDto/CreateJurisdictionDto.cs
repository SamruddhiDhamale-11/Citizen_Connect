namespace CitizenConnect.API.DTOs.JurisdictionDto
{
    public class CreateJurisdictionDto
    {
        public string JurisdictionName { get; set; }
            = string.Empty;

        public int JurisdictionTypeId { get; set; }

        public string? Address { get; set; }

        public decimal Latitude { get; set; }

        public decimal Longitude { get; set; }

        public string? Pincode { get; set; }
    }
}