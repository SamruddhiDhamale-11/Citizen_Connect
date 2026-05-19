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

        public string Gender { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

        public string GovernmentId { get; set; } = string.Empty;

        public string? ProfilePhoto { get; set; }

        public string? IdProofPath { get; set; }

        public string WardNumber { get; set; } = string.Empty;

        public string WardName { get; set; } = string.Empty;

        public string PartName { get; set; } = string.Empty;

        // WardId is nullable — politicians are no longer required to select
        // a ward from a dropdown. They provide WardNumber and WardName as text.
        public int? WardId { get; set; }

        public int JurisdictionTypeId { get; set; }

        // Navigation
        public User User { get; set; } = null!;

        public Ward? Ward { get; set; }

        public JurisdictionType JurisdictionType { get; set; } = null!;
    }
}
