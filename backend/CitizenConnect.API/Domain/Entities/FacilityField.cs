using CitizenConnect.Domain.Common;

namespace CitizenConnect.API.Domain.Entities
{
    public class FacilityField : BaseEntity
    {
        public int FacilityFieldId { get; set; }

        public int FacilityModuleId { get; set; }

        public string FieldName { get; set; }
            = string.Empty;

        // text
        // number
        // textarea
        // dropdown
        public string FieldType { get; set; }
            = string.Empty;

        public bool IsRequired { get; set; }

        public int DisplayOrder { get; set; }

        public string? Placeholder { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation
        public FacilityModule FacilityModule
        { get; set; } = null!;
    }
}
