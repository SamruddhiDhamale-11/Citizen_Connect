namespace CitizenConnect.API.DTOs.WardBoundary
{
    public class UploadWardBoundaryDto
    {
        public int WardId { get; set; }

        public string GeoJson { get; set; } = string.Empty;
    }
}
