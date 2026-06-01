
using CitizenConnect.API.Domain.Entities;
using CitizenConnect.Domain.Common;

namespace CitizenConnect.Domain.Entities
{
    public class JurisdictionType : BaseEntity
    {
        public int JurisdictionTypeId { get; set; }

        public string JurisdictionTypeName { get; set; } = string.Empty;

        public string? JurisdictionDescription { get; set; }

        // Navigation
        public ICollection<Jurisdiction> Jurisdictions
        { get; set; }
        = new List<Jurisdiction>();
    }
}