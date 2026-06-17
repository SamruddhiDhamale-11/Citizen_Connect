namespace CitizenConnect.API.DTOs.FacilityDataDto
{
    public class CreateFacilityDataDto
    {
        public int FacilityRecordId { get; set; }

        public int FacilityFieldId { get; set; }

        public string FieldValue { get; set; }
            = string.Empty;
    }
}