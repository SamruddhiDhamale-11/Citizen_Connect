using CitizenConnect.Domain.Common;

namespace CitizenConnect.Domain.Entities
{
    public class SuggestionVote
        : BaseEntity
    {
        public int SuggestionVoteId
        { get; set; }

        public int SuggestionId
        { get; set; }

        public int CitizenId
        { get; set; }

        public bool IsUpVote
        { get; set; }
            = true;


        /**
         * =====================================
         * Navigation Properties
         * =====================================
         */

        public Suggestion Suggestion
        { get; set; } = null!;

        public Citizen Citizen
        { get; set; } = null!;
    }
}