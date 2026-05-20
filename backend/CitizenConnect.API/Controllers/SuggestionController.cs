using CitizenConnect.Application.DTOs.Suggestion;
using CitizenConnect.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace CitizenConnect.API.Controllers
{
    [ApiController]
    [Route("api/suggestions")]
    public class SuggestionController
        : ControllerBase
    {
        private readonly ISuggestionService
            _suggestionService;

        public SuggestionController(
            ISuggestionService suggestionService)
        {
            _suggestionService =
                suggestionService;
        }


        /**
         * =====================================================
         * GET SUGGESTION CATEGORIES
         * =====================================================
         */

        [HttpGet("categories")]
        public async Task<IActionResult>
            GetSuggestionCategories()
        {
            try
            {
                var result =
                    await _suggestionService
                    .GetSuggestionCategoriesAsync();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,

                    message = ex.Message
                });
            }
        }


        /**
         * =====================================================
         * CREATE SUGGESTION
         * =====================================================
         */

        [HttpPost]
        public async Task<IActionResult>
            CreateSuggestion(
                [FromBody]
                CreateSuggestionRequestDto request)
        {
            try
            {
                var result =
                    await _suggestionService
                    .CreateSuggestionAsync(
                        request.CitizenId,
                        request.WardId,
                        request);

                return Ok(new
                {
                    success = true,

                    message =
                        "Suggestion submitted successfully.",

                    data = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,

                    message = ex.Message
                });
            }
        }


        /**
         * =====================================================
         * GET MY SUGGESTIONS
         * =====================================================
         */

        [HttpGet("my/{citizenId}")]
        public async Task<IActionResult>
            GetMySuggestions(
                int citizenId)
        {
            try
            {
                var result =
                    await _suggestionService
                    .GetCitizenSuggestionsAsync(
                        citizenId);

                return Ok(new
                {
                    success = true,

                    data = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,

                    message = ex.Message
                });
            }
        }
    }
}