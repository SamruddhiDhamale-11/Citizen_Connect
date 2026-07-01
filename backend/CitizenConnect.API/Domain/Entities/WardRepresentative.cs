using CitizenConnect.Domain.Common;

namespace CitizenConnect.API.Domain.Entities
{
    public class WardRepresentative : BaseEntity
    {
        public int Id { get; set; }

        public int WardId { get; set; }

        public string RepresentativeName { get; set; }

        public string Designation { get; set; }

        public string MobileNumber { get; set; }

        public string? Email { get; set; }

        public string? Address { get; set; }

        public bool IsDeleted { get; set; } = false;

        // Navigation Property
        public virtual Ward Ward { get; set; }
    }
}