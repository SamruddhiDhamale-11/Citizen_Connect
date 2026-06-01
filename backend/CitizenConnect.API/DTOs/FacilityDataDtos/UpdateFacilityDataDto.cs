namespace CitizenConnect.API.DTOs.FacilityDataDto
{
    public class UpdateFacilityDataDto
    {
        public int FacilityDataId { get; set; }

        public int FacilityModuleId { get; set; }

        public int FacilityFieldId { get; set; }

        public int JurisdictionId { get; set; }

        public int? WardId { get; set; }

        public string FieldValue { get; set; }
            = string.Empty;
    }
}