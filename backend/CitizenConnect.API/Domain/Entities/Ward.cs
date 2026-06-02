using CitizenConnect.API.Domain.Entities;
using CitizenConnect.Domain.Common;

namespace CitizenConnect.Domain.Entities
{
    public class Ward : BaseEntity
    {
        public int WardId { get; set; }

        public string WardNumber { get; set; } = string.Empty;

        public string WardName { get; set; } = string.Empty;

        public string AreaName { get; set; } = string.Empty;

        public string Pincode { get; set; } = string.Empty;

        public string? WardDescription { get; set; }

        public decimal Latitude { get; set; }

        public decimal Longitude { get; set; }

        public int JurisdictionTypeId { get; set; }

        // Navigation
        public JurisdictionType JurisdictionType
        { get; set; } = null!;

        public ICollection<Citizen> Citizens { get; set; }= new List<Citizen>();

        public ICollection<Politician> Politicians { get; set; }
            = new List<Politician>();

        public ICollection<Complaint> Complaints { get; set; }
    = new List<Complaint>();

        public ICollection<Locality> Localities
        { get; set; }
           = new List<Locality>();

        public ICollection<WardDepartment> WardDepartments
        { get; set; }
    = new List<WardDepartment>();


        public ICollection<FacilityData> FacilityDatas
        { get; set; }
    = new List<FacilityData>();

        public ICollection<Demographic> Demographics
        {
            get; set;
        } = new List<Demographic>();
    }
}