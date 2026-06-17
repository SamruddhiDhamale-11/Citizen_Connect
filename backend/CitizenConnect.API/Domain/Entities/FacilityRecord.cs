using CitizenConnect.Domain.Common;

namespace CitizenConnect.API.Domain.Entities
{
    public class FacilityRecord : BaseEntity
    {
        public int FacilityRecordId { get; set; }

        public int FacilityModuleId { get; set; }

        public int JurisdictionId { get; set; }

        // NULL = Entire Village
        // Value = Specific Ward
        public int? WardId { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation Properties
        public FacilityModule FacilityModule { get; set; } = null!;

        public Jurisdiction Jurisdiction { get; set; } = null!;

        public Ward? Ward { get; set; }

        public ICollection<FacilityData> FacilityDatas
        { get; set; } = new List<FacilityData>();
    }
}
