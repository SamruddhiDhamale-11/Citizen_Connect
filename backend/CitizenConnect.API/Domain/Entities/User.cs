
using CitizenConnect.Domain.Common;

namespace CitizenConnect.Domain.Entities
{
    public class User : BaseEntity
    {
        public int UserId { get; set; }

        public int RoleId { get; set; }

        public string FirstName { get; set; } = string.Empty;

        public string? MiddleName { get; set; }

        public string LastName { get; set; } = string.Empty;

        public string MobileNo { get; set; } = string.Empty;

        public string? WhatsappNo { get; set; }

        public string Gender { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public DateTime? LastLoginAt { get; set; }

        public string PreferredLanguage { get; set; } = "EN";

        // Navigation
        public Role Role { get; set; } = null!;

        public Citizen? Citizen { get; set; }

        public Politician? Politician { get; set; }

        public ICollection<ComplaintStatusHistory>
    ComplaintStatusHistories
        { get; set; }
    = new List<ComplaintStatusHistory>();
    }
}