using CitizenConnect.API.Domain.Enums;

namespace CitizenConnect.DTOs.Admin
{
    public class UpdateSuggestionStatusDto
    {
        public SuggestionStatus Status
        { get; set; }

        public string? Remarks
        { get; set; }

        public int ChangedByUserId
        { get; set; }
    }
}