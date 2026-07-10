namespace CitizenConnect.API.DTOs.LocalityBoundaryDtos
{
    public class LocalityBoundaryResponseDto
    {
        public int LocalityBoundaryId { get; set; }

        public int LocalityId { get; set; }

        public string LocalityName { get; set; } = string.Empty;

        public decimal Latitude { get; set; }

        public decimal Longitude { get; set; }

        public string? Pincode { get; set; }

        public string? Landmark { get; set; }

        public string GeoJson { get; set; } = string.Empty;
    }
}