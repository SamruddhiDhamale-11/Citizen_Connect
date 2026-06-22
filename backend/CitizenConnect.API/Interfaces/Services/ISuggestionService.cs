
using CitizenConnect.Application.DTOs.Suggestion;
using CitizenConnect.DTOs.Admin;

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

        Task<List<object>>
            GetSuggestionCategoriesAsync();

           Task<List<object>>
GetSuggestionCategoriesByDepartmentAsync(
    int departmentId);

        Task<List<object>>
            GetAllSuggestionsAsync();
            Task<List<SuggestionHistoryDto>> GetSuggestionHistoryAsync(int suggestionId);

        Task UpdateSuggestionStatusAsync(
    UpdateSuggestionStatusDto request);
    }
}