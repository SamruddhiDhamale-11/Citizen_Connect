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

        public string ExpectedBenefit
        { get; set; }
            = string.Empty;

        public string StatusName { get; set; }
    = string.Empty;
        public DateTime CreatedDate
        { get; set; }

        public string? LatestRemark { get; set; }

        public string? ImageUrl { get; set; }
    }
}