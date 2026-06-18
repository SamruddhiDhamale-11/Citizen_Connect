using CitizenConnect.Domain.Common;

namespace CitizenConnect.API.Domain.Entities
{
    public class FacilityModule : BaseEntity
    {
        public int FacilityModuleId { get; set; }

        // Water Supply
        // Health Facilities
        public string ModuleName { get; set; }
            = string.Empty;

        public string? ModuleDescription { get; set; }

        public string? IconName { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation
        public ICollection<FacilityField> FacilityFields
        { get; set; }
            = new List<FacilityField>();


        public ICollection<FacilityData> FacilityDatas
        { get; set; } = new List<FacilityData>();

        public ICollection<FacilityRecord> FacilityRecords
        { get; set; }
    = new List<FacilityRecord>();
    }
}
