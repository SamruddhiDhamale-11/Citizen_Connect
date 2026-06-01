
using CitizenConnect.API.DTOs.Suggestion;
using CitizenConnect.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using CitizenConnect.Application.Interfaces.Services;
using CitizenConnect.Application.DTOs.Suggestion;

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
public async Task<IActionResult> CreateSuggestion(
    [FromForm] CreateSuggestionRequestDto request)
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




    }
}