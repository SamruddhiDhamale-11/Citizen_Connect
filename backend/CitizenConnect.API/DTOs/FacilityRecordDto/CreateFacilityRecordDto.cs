namespace CitizenConnect.API.DTOs.FacilityRecordDto
{
    public class CreateFacilityRecordDto
    {
        public int FacilityModuleId { get; set; }

        public int JurisdictionId { get; set; }

        public int? WardId { get; set; }
    }
}
