namespace CitizenConnect.API.DTOs.FacilityRecordDto
{
    public class CreateFacilityRecordWithDataDto
    {
        public int FacilityModuleId { get; set; }

        public int JurisdictionId { get; set; }

        public int? WardId { get; set; }

        public List<FacilityFieldValueDto> Fields
        { get; set; }
            = new();
    }
}
