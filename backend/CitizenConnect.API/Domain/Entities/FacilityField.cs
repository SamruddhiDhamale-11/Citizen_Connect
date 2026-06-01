using CitizenConnect.API.Domain.Enums;
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
        public FacilityFieldType FieldType
        { get; set; }

        public bool IsRequired { get; set; }

        public int DisplayOrder { get; set; }

        public string? Placeholder { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation
        public FacilityModule FacilityModule
        { get; set; } = null!;

        public ICollection<FacilityData> FacilityDatas
        { get; set; } = new List<FacilityData>();

        public ICollection<FacilityFieldOption> FacilityFieldOptions
        { get; set; }
        = new List<FacilityFieldOption>();

    }
}
