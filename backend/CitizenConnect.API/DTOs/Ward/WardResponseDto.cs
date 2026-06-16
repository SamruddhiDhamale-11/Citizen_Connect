namespace CitizenConnect.API.DTOs.Ward
{
    public class WardResponseDto
    {
        public int WardId { get; set; }

        public string WardNumber { get; set; } = string.Empty;

        public string WardName { get; set; } = string.Empty;

        public string AreaName { get; set; } = string.Empty;

        public string Pincode { get; set; } = string.Empty;

        public string? WardDescription { get; set; }

        public decimal Latitude { get; set; }

        public decimal Longitude { get; set; }

        public int JurisdictionId { get; set; }

        public string JurisdictionName { get; set; }
            = string.Empty;

        public int LocalityCount { get; set; }

        public int CitizenCount { get; set; }

        public int ComplaintCount { get; set; }
    }
}