using CitizenConnect.API.Domain.Enums;

namespace CitizenConnect.Application.DTOs.Facility
{
    public class UpdateFacilityFieldDto
    {
        public int FacilityFieldId { get; set; }

        public int FacilityModuleId { get; set; }

        public string FieldName { get; set; }
            = string.Empty;

        public FacilityFieldType FieldType { get; set; }

        public bool IsRequired { get; set; }

        public int DisplayOrder { get; set; }

        public string? Placeholder { get; set; }

        public bool IsActive { get; set; }
    }
}