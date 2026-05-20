using CitizenConnect.API.Domain.Enums;

namespace CitizenConnect.Application.DTOs.Suggestion
{
    public class CreateSuggestionRequestDto
    {
        public int CitizenId
        { get; set; }

        public int WardId
        { get; set; }

        public int SuggestionCategoryId
        { get; set; }

        public string Title
        { get; set; }
            = string.Empty;

        public string Description
        { get; set; }
            = string.Empty;

        public string ExpectedBenefit
        { get; set; }
            = string.Empty;

        public BenefitScope BenefitScope
        { get; set; }

        public bool IsAnonymous
        { get; set; }
    }
}