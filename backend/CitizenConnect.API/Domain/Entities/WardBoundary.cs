using CitizenConnect.API.Domain.Entities;
using CitizenConnect.Domain.Common;

namespace CitizenConnect.Domain.Entities
{
    public class WardBoundary : BaseEntity
    {
        public int WardBoundaryId { get; set; }

        public int WardId { get; set; }

        public string GeoJson { get; set; } = string.Empty;

        public Ward Ward { get; set; } = null!;
    }
}