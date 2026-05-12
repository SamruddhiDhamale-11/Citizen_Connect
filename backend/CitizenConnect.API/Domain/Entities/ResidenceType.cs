using CitizenConnect.Domain.Common;

namespace CitizenConnect.Domain.Entities
{
    public class ResidenceType : BaseEntity
    {
        public int ResidenceTypeId { get; set; }

        public string ResidenceTypeName { get; set; } = string.Empty;

        // Navigation
        public ICollection<Citizen> Citizens { get; set; }
            = new List<Citizen>();
    }
}