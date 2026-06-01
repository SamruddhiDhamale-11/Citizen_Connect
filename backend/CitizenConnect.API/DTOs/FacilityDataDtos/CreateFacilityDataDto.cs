namespace CitizenConnect.API.DTOs.FacilityDataDto
{
    public class CreateFacilityDataDto
    {
        public int FacilityModuleId { get; set; }

        public int FacilityFieldId { get; set; }

        public int JurisdictionId { get; set; }

        // Null means whole village
        public int? WardId { get; set; }

        public string FieldValue { get; set; }
            = string.Empty;
    }
}