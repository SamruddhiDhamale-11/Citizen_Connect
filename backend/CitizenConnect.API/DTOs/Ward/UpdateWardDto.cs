namespace CitizenConnect.API.DTOs.Ward
{
    public class UpdateWardDto
    {
        public string WardNumber { get; set; } = string.Empty;

        public string WardName { get; set; } = string.Empty;

        public string AreaName { get; set; } = string.Empty;

        public string Pincode { get; set; } = string.Empty;

        public string? WardDescription { get; set; }

        public decimal Latitude { get; set; }

        public decimal Longitude { get; set; }

        public int JurisdictionId { get; set; }
    }
}