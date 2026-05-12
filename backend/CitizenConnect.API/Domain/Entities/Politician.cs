
using CitizenConnect.Domain.Common;

namespace CitizenConnect.Domain.Entities
{
    public class Politician : BaseEntity
    {
        public int PoliticianId { get; set; }

        public int UserId { get; set; }

        public string PartyName { get; set; } = string.Empty;

        public string PoliticianRole { get; set; } = string.Empty;

        public int Age { get; set; }

        public string Address { get; set; } = string.Empty;

        public string GovernmentId { get; set; } = string.Empty;

        public string? ProfilePhoto { get; set; }

        public int WardId { get; set; }

        public int JurisdictionTypeId { get; set; }

        // Navigation
        public User User { get; set; } = null!;

        public Ward Ward { get; set; } = null!;

        public JurisdictionType JurisdictionType { get; set; } = null!;
    }
}