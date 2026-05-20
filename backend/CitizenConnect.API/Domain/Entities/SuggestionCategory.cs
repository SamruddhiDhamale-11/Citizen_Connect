using CitizenConnect.Domain.Common;

namespace CitizenConnect.Domain.Entities
{
    public class SuggestionCategory : BaseEntity
    {
        public int SuggestionCategoryId { get; set; }

        public string CategoryName { get; set; }
            = string.Empty;

        public string? Description { get; set; }

        public ICollection<Suggestion>
            Suggestions
        { get; set; }
            = new List<Suggestion>();
    }
}