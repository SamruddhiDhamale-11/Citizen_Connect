
using CitizenConnect.API.Domain.Entities;
using CitizenConnect.Domain.Common;

namespace CitizenConnect.Domain.Entities
{
    public class Citizen : BaseEntity
    {
        public int CitizenId { get; set; }

        public int UserId { get; set; }

        public DateTime DateOfBirth { get; set; }

        public int WardId { get; set; }
        public int LocalityId { get; set; }

        public int ResidenceTypeId { get; set; }

        public bool IsVoterRegistered { get; set; }

        
        // Navigation
        public User User { get; set; } = null!;

        public Ward Ward { get; set; } = null!;

        public Locality Locality { get; set; } = null!;

        public ResidenceType ResidenceType { get; set; } = null!;

        public ICollection<Complaint> Complaints { get; set; }
    = new List<Complaint>();

        public ICollection<Suggestion> Suggestions
        { get; set; }
    = new List<Suggestion>();

        public ICollection<SuggestionVote> SuggestionVotes
        { get; set; }
            = new List<SuggestionVote>();
    }
}