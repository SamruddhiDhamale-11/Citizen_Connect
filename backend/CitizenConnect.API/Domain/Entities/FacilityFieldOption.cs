using CitizenConnect.Domain.Common;

namespace CitizenConnect.API.Domain.Entities
{
    public class FacilityFieldOption : BaseEntity
    {
        public int FacilityFieldOptionId { get; set; }

        public int FacilityFieldId { get; set; }

        public string OptionText { get; set; }
            = string.Empty;

        public int DisplayOrder { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation Property
        public FacilityField FacilityField
        { get; set; } = null!;
    }
}