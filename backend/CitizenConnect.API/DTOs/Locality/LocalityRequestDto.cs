namespace CitizenConnect.Application.DTOs.Locality
{
    public class LocalityRequestDto
    {
        public string LocalityName { get; set; }
            = string.Empty;

        public string? Description { get; set; }

        public int WardId { get; set; }

        public int LocalityTypeId { get; set; }

        public decimal Latitude { get; set; }

        public decimal Longitude { get; set; }

        public string? Pincode { get; set; }

        public string? Landmark { get; set; }
    }
}