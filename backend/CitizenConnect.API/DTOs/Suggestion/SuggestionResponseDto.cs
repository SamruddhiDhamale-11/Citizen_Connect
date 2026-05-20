using CitizenConnect.API.Domain.Enums;

namespace CitizenConnect.Application.DTOs.Suggestion
{
    public class SuggestionResponseDto
    {
        public int SuggestionId
        { get; set; }

        public string SuggestionNumber
        { get; set; }
            = string.Empty;

        public string Title
        { get; set; }
            = string.Empty;

        public string Description
        { get; set; }
            = string.Empty;

        public string CategoryName
        { get; set; }
            = string.Empty;

        public string ExpectedBenefit
        { get; set; }
            = string.Empty;

        public string BenefitScopeDisplay
        { get; set; }
            = string.Empty;

        public SuggestionStatus Status
        { get; set; }

        public DateTime CreatedDate
        { get; set; }
    }
}