using CitizenConnect.Domain.Common;
using CitizenConnect.API.Domain.Enums;

namespace CitizenConnect.Domain.Entities
{
    public class SuggestionStatusHistory
        : BaseEntity
    {
        public int SuggestionStatusHistoryId
        { get; set; }

        public int SuggestionId { get; set; }

        public SuggestionStatus OldStatus
        { get; set; }

        public SuggestionStatus NewStatus
        { get; set; }

        public int ChangedByUserId
        { get; set; }

        public string? Remarks
        { get; set; }

        public DateTime ChangedAt
        { get; set; }
            = DateTime.UtcNow;


        /**
         * =====================================
         * Navigation Properties
         * =====================================
         */

        public Suggestion Suggestion
        { get; set; } = null!;

        public User ChangedByUser
        { get; set; } = null!;
    }
}