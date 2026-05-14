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

        public int JurisdictionTypeId { get; set; }

        public string? WardDescription { get; set; }

        public decimal Latitude { get; set; }

        public decimal Longitude { get; set; }

        // Navigation
        public JurisdictionType JurisdictionType { get; set; } = null!;

        public ICollection<Citizen> Citizens { get; set; }
            = new List<Citizen>();

        public ICollection<Politician> Politicians { get; set; }
            = new List<Politician>();

        public ICollection<Complaint> Complaints { get; set; }
    = new List<Complaint>();
    }
}