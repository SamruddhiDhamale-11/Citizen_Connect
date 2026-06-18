namespace CitizenConnect.API.DTOs.FacilityDataDto
{
    public class UpdateFacilityDataDto
    {
        public int FacilityDataId { get; set; }

        public string FieldValue { get; set; }
            = string.Empty;
    }
}