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

        public string OldStatus { get; set; }
     = string.Empty;

        public string NewStatus { get; set; }
            = string.Empty;

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

    }
}