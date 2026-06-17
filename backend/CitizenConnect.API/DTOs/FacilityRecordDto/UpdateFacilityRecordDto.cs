namespace CitizenConnect.API.DTOs.FacilityRecordDto
{
    public class UpdateFacilityRecordDto
    {
        public int FacilityRecordId { get; set; }

        public int FacilityModuleId { get; set; }

        public int JurisdictionId { get; set; }

        public int? WardId { get; set; }

        public bool IsActive { get; set; }
    }
}
