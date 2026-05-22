using CitizenConnect.API.Domain.Entities;
using CitizenConnect.Domain.Common;

namespace CitizenConnect.Domain.Entities
{
    public class LocalityType : BaseEntity
    {
        public int LocalityTypeId { get; set; }

        public string TypeName { get; set; }
            = string.Empty;

        public string? Description { get; set; }

        // Navigation Property

        public ICollection<Locality> Localities
        { get; set; }
            = new List<Locality>();
    }
}