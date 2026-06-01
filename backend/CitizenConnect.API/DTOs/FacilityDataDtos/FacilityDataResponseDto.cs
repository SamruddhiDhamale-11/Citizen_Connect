
namespace CitizenConnect.Application.DTOs
    .FacilityDataDtos
{
    public class FacilityDataResponseDto
    {
        public int FacilityDataId { get; set; }

        public int FacilityModuleId { get; set; }

        public string FacilityModuleName { get; set; }
            = string.Empty;

        public int FacilityFieldId { get; set; }

        public string FacilityFieldName { get; set; }
            = string.Empty;

        public int JurisdictionId { get; set; }

        public string JurisdictionName { get; set; }
            = string.Empty;

        public int? WardId { get; set; }

        public string? WardName { get; set; }

        public string FieldValue { get; set; }
            = string.Empty;

        public DateTime CreatedAt { get; set; }
    }
}
