
namespace CitizenConnect.Application.DTOs
    .FacilityFieldDtos
{
    public class FacilityFieldResponseDto
    {
        public int FacilityFieldId { get; set; }

        public int FacilityModuleId { get; set; }

        public string FieldName { get; set; }
            = string.Empty;

        public string FieldType { get; set; }
            = string.Empty;

        public bool IsRequired { get; set; }

        public int DisplayOrder { get; set; }

        public string? Placeholder
        { get; set; }

        public bool IsActive { get; set; }
    }
}

