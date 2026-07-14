using CitizenConnect.Domain.Common;

namespace CitizenConnect.API.Domain.Entities
{
    public class LocalityBoundary : BaseEntity
    {
        public int LocalityBoundaryId { get; set; }

        public int LocalityId { get; set; }

        public string GeoJson { get; set; } = string.Empty;

        public Locality Locality { get; set; } = null!;
    }
}
