using CitizenConnect.API.Domain.Enums;
using CitizenConnect.API.DTOs.FacilityFieldOptionDto;

namespace CitizenConnect.API.DTOs.FacilityRecordDto
{
    public class FacilityFieldDetailsDto
    {
        public int FacilityFieldId { get; set; }

        public string FieldName { get; set; }
            = string.Empty;

        public FacilityFieldType FieldType
        { get; set; }

        public bool IsRequired { get; set; }

        public string? Placeholder
        { get; set; }

        public string? FieldValue
        { get; set; }

        public List<FacilityFieldOptionResponseDto>
            Options
        { get; set; } = new();
    }
}