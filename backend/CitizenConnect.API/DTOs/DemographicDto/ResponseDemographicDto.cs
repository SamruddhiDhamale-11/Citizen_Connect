namespace CitizenConnect.API.DTOs.DemographicDto
{
    public class ResponseDemographicDto
    {
        public int DemographicId { get; set; }

        public int JurisdictionId { get; set; }

        public string JurisdictionName { get; set; } = string.Empty;

        public int? WardId { get; set; }

        public string? WardName { get; set; }

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

        public bool IsActive { get; set; }
    }
}
