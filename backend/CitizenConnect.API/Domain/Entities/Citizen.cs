
using CitizenConnect.Domain.Common;

namespace CitizenConnect.Domain.Entities
{
    public class Citizen : BaseEntity
    {
        public int CitizenId { get; set; }

        public int UserId { get; set; }

        public DateTime DateOfBirth { get; set; }

        public int WardId { get; set; }

        public int ResidenceTypeId { get; set; }

        public bool IsVoterRegistered { get; set; }

        // Navigation
        public User User { get; set; } = null!;

        public Ward Ward { get; set; } = null!;

        public ResidenceType ResidenceType { get; set; } = null!;

        public ICollection<Complaint> Complaints { get; set; }
    = new List<Complaint>();
    }
}