
using CitizenConnect.Domain.Common;

namespace CitizenConnect.Domain.Entities
{
    public class Role : BaseEntity
    {
        public int RoleId { get; set; }

        public string RoleName { get; set; } = string.Empty;

        public string? RoleDescription { get; set; }

        // Navigation
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}