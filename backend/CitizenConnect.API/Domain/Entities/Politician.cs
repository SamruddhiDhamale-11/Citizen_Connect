using CitizenConnect.API.Domain.Entities;
using CitizenConnect.Domain.Common;

namespace CitizenConnect.Domain.Entities
{
    public class Politician : BaseEntity
    {
        public int PoliticianId { get; set; }

        public int UserId { get; set; }

        public string PartyName { get; set; }
            = string.Empty;

        // Sarpanch
        // Mayor
        // Corporator
        public string PoliticianRole { get; set; }
            = string.Empty;

        public int Age { get; set; }

        public string Gender { get; set; }
            = string.Empty;

        public string Address { get; set; }
            = string.Empty;

        public string GovernmentId { get; set; }
            = string.Empty;

        public string? ProfilePhoto { get; set; }

        public string? IdProofPath { get; set; }

        // =====================================
        // RELATIONSHIPS
        // =====================================

        // Mandatory
        public int JurisdictionTypeId { get; set; }

        public JurisdictionType JurisdictionType
        { get; set; } = null!;

        // Optional
        // NULL = Jurisdiction level politician
        // Value = Ward level politician
        public int? WardId { get; set; }

        // =====================================
        // NAVIGATION
        // =====================================

        public User User { get; set; } = null!;

       

        public Ward? Ward { get; set; }
    }
}