using CitizenConnect.Domain.Common;
using CitizenConnect.Domain.Entities;

namespace CitizenConnect.API.Domain.Entities
{
    public class FacilityData : BaseEntity
    {
        public int FacilityDataId { get; set; }

        public int FacilityModuleId { get; set; }

        public int FacilityFieldId { get; set; }

        public int JurisdictionId { get; set; }

        // NULL = Entire Village
        // Value = Specific Ward
        public int? WardId { get; set; }

        public string FieldValue { get; set; }
            = string.Empty;

        // Navigation
        public FacilityModule FacilityModule
        { get; set; } = null!;

        public FacilityField FacilityField
        { get; set; } = null!;

        public Jurisdiction Jurisdiction
        { get; set; } = null!;

        public Ward? Ward { get; set; }
    }
}
