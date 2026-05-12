
using CitizenConnect.Domain.Common;

namespace CitizenConnect.Domain.Entities
{
    public class JurisdictionType : BaseEntity
    {
        public int JurisdictionTypeId { get; set; }

        public string JurisdictionTypeName { get; set; } = string.Empty;

        public string? JurisdictionDescription { get; set; }

        // Navigation
        public ICollection<Ward> Wards { get; set; }
            = new List<Ward>();

        public ICollection<Politician> Politicians { get; set; }
            = new List<Politician>();
    }
}