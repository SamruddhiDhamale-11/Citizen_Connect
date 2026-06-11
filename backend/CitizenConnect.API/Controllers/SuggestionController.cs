
using CitizenConnect.API.DTOs.Suggestion;
using CitizenConnect.Application.DTOs.Suggestion;
using CitizenConnect.Application.Interfaces.Services;
using CitizenConnect.DTOs.Admin;
using CitizenConnect.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace CitizenConnect.API.Controllers
{
    [ApiController]
[Route("api/suggestions")]
public class SuggestionController : ControllerBase
{
    private readonly ISuggestionService _suggestionService;
    private readonly ICloudinaryService _cloudinaryService;

    public SuggestionController(
        ISuggestionService suggestionService,
        ICloudinaryService cloudinaryService)
    {
        _suggestionService = suggestionService;
        _cloudinaryService = cloudinaryService;
    }

        /**
         * =====================================================
         * GET SUGGESTION CATEGORIES
         * =====================================================
         */

        [HttpGet("categories")]
        public async Task<IActionResult>
            GetCategories()
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
        [HttpPost]
        public async Task<IActionResult> CreateSuggestion(
    [FromForm] CreateSuggestionRequestDto request)
        {
            try
            {
                Console.WriteLine($"CategoryId = {request.SuggestionCategoryId}");

                var result =
                    await _suggestionService
                    .CreateSuggestionAsync(
                        request.CitizenId,
                        request.WardId,
                        request);

                return Ok(new
                {
                    success = true,
                    message = "Suggestion submitted successfully.",
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

        [HttpGet("admin")]
public async Task<IActionResult> GetAllSuggestions()
{
    try
    {
        var result = await _suggestionService.GetAllSuggestionsAsync();

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

//attachment file logic
[HttpPost("upload-attachment")]
public async Task<IActionResult> UploadAttachment(
    [FromForm] IFormFile file)
{
    try
    {
        var url = await _cloudinaryService.UploadImageAsync(file);

        return Ok(new
        {
            success = true,
            data = url
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

// =====================================================
// SUGGESTION HISTORY
// =====================================================

[HttpGet("history/{suggestionId}")]
public async Task<IActionResult> GetSuggestionHistory(int suggestionId)
{
    try
    {
        var result = await _suggestionService.GetSuggestionHistoryAsync(suggestionId);

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

        // =====================================================
        // UPDATE SUGGESTION STATUS
        // =====================================================

        [HttpPut("status")]
        public async Task<IActionResult> UpdateSuggestionStatus(
            [FromBody] UpdateSuggestionStatusDto request)
        {
            try
            {
                await _suggestionService
                    .UpdateSuggestionStatusAsync(request);

                return Ok(new
                {
                    success = true,
                    message = "Suggestion status updated successfully."
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