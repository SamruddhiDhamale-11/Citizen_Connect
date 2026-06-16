using CitizenConnect.API.Domain.Entities;
using CitizenConnect.API.Domain.Enums;
using CitizenConnect.Domain.Common;

namespace CitizenConnect.Domain.Entities
{
    public class Suggestion : BaseEntity
    {
        public int SuggestionId { get; set; }

        public string SuggestionNumber { get; set; }
            = string.Empty;

        public int CitizenId { get; set; }

        public int WardId { get; set; }

        public int SuggestionCategoryId { get; set; }

        /**
         * =========================================
         * UI FIELDS
         * =========================================
         */

        public string Title { get; set; }
            = string.Empty;

        public string Description { get; set; }
            = string.Empty;

        public string ExpectedBenefit { get; set; }
            = string.Empty;

        public BenefitScope BenefitScope { get; set; }

        public int SuggestionStatusMasterId { get; set; }

        public SuggestionStatusMaster SuggestionStatusMaster
        { get; set; } = null!;
        public bool IsAnonymous { get; set; }

        public string? AdminRemarks { get; set; }

        public DateTime? ReviewedAt { get; set; }

        public int TotalVotes { get; set; }


        /**
         * =========================================
         * Navigation Properties
         * =========================================
         */

        public Citizen Citizen { get; set; } = null!;

        public Ward Ward { get; set; } = null!;

        public SuggestionCategory SuggestionCategory
        { get; set; } = null!;

        public ICollection<SuggestionAttachment>
            SuggestionAttachments
        { get; set; }
            = new List<SuggestionAttachment>();

        public ICollection<SuggestionStatusHistory>
            SuggestionStatusHistories
        { get; set; }
            = new List<SuggestionStatusHistory>();

        public ICollection<SuggestionVote>
            SuggestionVotes
        { get; set; }
            = new List<SuggestionVote>();
    }
}