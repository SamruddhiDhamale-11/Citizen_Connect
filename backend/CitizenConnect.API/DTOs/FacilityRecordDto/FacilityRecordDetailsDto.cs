namespace CitizenConnect.API.DTOs.FacilityRecordDto
{
    public class FacilityRecordDetailsDto
    {
        public int FacilityRecordId { get; set; }

        public int FacilityModuleId { get; set; }

        public string FacilityModuleName { get; set; }
            = string.Empty;

        public int JurisdictionId { get; set; }

        public string JurisdictionName { get; set; }
            = string.Empty;

        public int? WardId { get; set; }

        public string? WardName { get; set; }

        public bool IsActive { get; set; }

        public List<FacilityFieldDetailsDto> Fields
        { get; set; } = new();
    }
}