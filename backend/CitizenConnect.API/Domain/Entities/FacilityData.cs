using CitizenConnect.Domain.Common;
using CitizenConnect.Domain.Entities;

namespace CitizenConnect.API.Domain.Entities
{
    public class FacilityData : BaseEntity
    {
        public int FacilityDataId { get; set; }

        public int FacilityRecordId { get; set; }

        public int FacilityFieldId { get; set; }

        

        public string FieldValue { get; set; }
            = string.Empty;

        // Navigation
        public FacilityRecord FacilityRecord
        { get; set; } = null!;

        public FacilityField FacilityField
        { get; set; } = null!;
    }
}
