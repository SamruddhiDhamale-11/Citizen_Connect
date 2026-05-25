namespace CitizenConnect.API.DTOs.Suggestion
{
   public class UpdateSuggestionStatusDto
{
    public int SuggestionId { get; set; }

    public required string Status { get; set; }

    public string? Remarks { get; set; }

}
}