using CitizenConnect.Domain.Common;
using CitizenConnect.Domain.Entities;

namespace CitizenConnect.API.Domain.Entities
{
    public class Demographic : BaseEntity
    {
        public int DemographicId { get; set; }

        public int JurisdictionId { get; set; }

        // NULL = Entire Jurisdiction
        // Value = Specific Ward
        public int? WardId { get; set; }

        public int TotalPopulation { get; set; }

        public int MalePopulation { get; set; }

        public int FemalePopulation { get; set; }

        public int ChildPopulation { get; set; }

        public int SeniorCitizenPopulation { get; set; }

        public int TotalHouseholds { get; set; }

        public decimal MaleLiteracyRate { get; set; }
        public decimal FemaleLiteracyRate { get; set; }

        public decimal TotalLiteracyRate { get; set; }

        public int TotalVoters { get; set; }

        public int SurveyYear { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation
        public Jurisdiction Jurisdiction
        { get; set; } = null!;

        public Ward? Ward
        { get; set; }
    }
}
