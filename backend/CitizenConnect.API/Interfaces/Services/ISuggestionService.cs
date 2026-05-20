using CitizenConnect.Application.DTOs.Suggestion;

namespace CitizenConnect.Application.Interfaces.Services
{
    public interface ISuggestionService
    {
        Task<SuggestionResponseDto>
            CreateSuggestionAsync(
                int citizenId,
                int wardId,
                CreateSuggestionRequestDto request);

        Task<List<SuggestionResponseDto>>
            GetCitizenSuggestionsAsync(
                int citizenId);
    }
}