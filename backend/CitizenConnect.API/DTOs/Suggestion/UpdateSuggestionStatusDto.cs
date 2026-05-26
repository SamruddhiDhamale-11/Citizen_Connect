namespace CitizenConnect.API.DTOs.Suggestion
{
    public class UpdateSuggestionStatusDto
    {
        public int SuggestionId { get; set; }

        public int SuggestionStatusMasterId
        { get; set; }

        public string? Remarks { get; set; }
    }
}