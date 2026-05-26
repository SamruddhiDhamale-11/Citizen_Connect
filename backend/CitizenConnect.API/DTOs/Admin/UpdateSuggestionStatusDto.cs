using CitizenConnect.API.Domain.Enums;

namespace CitizenConnect.DTOs.Admin
{
    public class UpdateSuggestionStatusDto
    {
        

        public string? Remarks
        { get; set; }

        public int ChangedByUserId
        { get; set; }



        public int SuggestionId { get; set; }

        public int SuggestionStatusMasterId
        { get; set; }

        
    }
}