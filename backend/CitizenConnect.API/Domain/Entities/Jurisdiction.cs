using CitizenConnect.Domain.Common;
using CitizenConnect.Domain.Entities;

namespace CitizenConnect.API.Domain.Entities
{
    public class Jurisdiction : BaseEntity
    {
        public int JurisdictionId { get; set; }

        // Ambale GramPanchayat
        public string JurisdictionName { get; set; }
            = string.Empty;

        public int JurisdictionTypeId { get; set; }

        public string? Address { get; set; }

        public decimal Latitude { get; set; }

        public decimal Longitude { get; set; }

        public string? Pincode { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation
        public JurisdictionType JurisdictionType{ get; set; } = null!;

        public ICollection<Ward> Wards { get; set; }= new List<Ward>();
        
        public ICollection<Politician> Politicians { get; set; } = new List<Politician>();

        public ICollection<FacilityData> FacilityDatas { get; set; } = new List<FacilityData>();

    }


}
