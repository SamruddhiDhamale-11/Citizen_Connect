namespace CitizenConnect.API.DTOs.LocalityBoundaryDtos
{
    public class UploadLocalityBoundaryDto
    {
        public int LocalityId { get; set; }

        public string GeoJson { get; set; } = string.Empty;
    }
}