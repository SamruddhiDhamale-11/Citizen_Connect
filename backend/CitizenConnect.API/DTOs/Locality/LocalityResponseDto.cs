namespace CitizenConnect.Application.DTOs.Locality
{
    public class LocalityResponseDto
    {
        public int LocalityId { get; set; }

        public string LocalityName { get; set; }
            = string.Empty;

        public string? Description { get; set; }

        public int WardId { get; set; }

        public string WardName { get; set; }
            = string.Empty;

        public int LocalityTypeId { get; set; }

        public string LocalityTypeName { get; set; }
            = string.Empty;

        public decimal Latitude { get; set; }

        public decimal Longitude { get; set; }

        public string? Pincode { get; set; }

        public string? Landmark { get; set; }
    }
}