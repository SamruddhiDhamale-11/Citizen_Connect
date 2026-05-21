using CitizenConnect.Domain.Common;
using CitizenConnect.Domain.Entities;

namespace CitizenConnect.API.Domain.Entities
{
    public class Locality : BaseEntity
    {
        public int LocalityId { get; set; }

        public string LocalityName { get; set; }
            = string.Empty;

        public string? Description { get; set; }

        public int WardId { get; set; }

        public int LocalityTypeId { get; set; }

        public decimal Latitude { get; set; }

        public decimal Longitude { get; set; }

        public string? Pincode { get; set; }

        public string? Landmark { get; set; }

        public Ward Ward { get; set; }
            = null!;

        public LocalityType LocalityType
        { get; set; }
            = null!;

        public ICollection<Citizen> Citizens
        { get; set; }
            = new List<Citizen>();

        public ICollection<Complaint> Complaints
        { get; set; }
            = new List<Complaint>();
    }
}
