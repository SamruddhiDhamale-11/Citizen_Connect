using CitizenConnect.Domain.Common;

namespace CitizenConnect.Domain.Entities
{
    public class SuggestionStatusMaster : BaseEntity
    {
        public int SuggestionStatusMasterId { get; set; }

        public string StatusName { get; set; }
            = string.Empty;

        public string? Description { get; set; }

        public int DisplayOrder { get; set; }

        // Navigation

        public ICollection<Suggestion> Suggestions
        { get; set; }
            = new List<Suggestion>();
    }
}