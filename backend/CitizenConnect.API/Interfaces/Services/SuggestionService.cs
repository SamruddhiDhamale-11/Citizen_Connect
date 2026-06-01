using CitizenConnect.API.Domain.Enums;
using CitizenConnect.Application.DTOs.Suggestion;
using CitizenConnect.Interfaces.Services;
using CitizenConnect.Domain.Entities;
using CitizenConnect.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using CitizenConnect.Application.Interfaces.Services;

namespace CitizenConnect.Application.Services
{
    public class SuggestionService : ISuggestionService
    {
        private readonly ApplicationDbContext _context;
        private readonly ICloudinaryService _cloudinaryService;

        public SuggestionService(
            ApplicationDbContext context,
            ICloudinaryService cloudinaryService)
        {
            _context = context;
            _cloudinaryService = cloudinaryService;
        }

        // =====================================================
        // CREATE SUGGESTION
        // =====================================================
        public async Task<SuggestionResponseDto> CreateSuggestionAsync(
            int citizenId,
            int wardId,
            CreateSuggestionRequestDto request)
        {
            // VALIDATE CATEGORY
            var categoryExists = await _context.SuggestionCategories
                .AnyAsync(x => x.SuggestionCategoryId == request.SuggestionCategoryId);

            if (!categoryExists)
                throw new Exception("Invalid suggestion category.");

            // GENERATE NUMBER
            var suggestionNumber = $"SG-{DateTime.UtcNow:yyyyMMddHHmmss}";

            // CREATE ENTITY
            var suggestion = new Suggestion
            {
                SuggestionNumber = suggestionNumber,
                CitizenId = citizenId,
                WardId = wardId,
                SuggestionCategoryId = request.SuggestionCategoryId,
                Title = request.Title,
                Description = request.Description,
                ExpectedBenefit = request.ExpectedBenefit,
                BenefitScope = request.BenefitScope,
                IsAnonymous = request.IsAnonymous,
                SuggestionStatusMasterId = 1,
                TotalVotes = 0,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Suggestions.AddAsync(suggestion);
            await _context.SaveChangesAsync();

            // LOAD STATUS NAVIGATION
            await _context.Entry(suggestion)
                .Reference(x => x.SuggestionStatusMaster)
                .LoadAsync();

            // STATUS HISTORY
            var statusHistory = new SuggestionStatusHistory
            {
                SuggestionId = suggestion.SuggestionId,
                OldStatus = "Pending",
                NewStatus = "Pending",
                Remarks = "Suggestion created.",
                ChangedAt = DateTime.UtcNow
            };

            await _context.SuggestionStatusHistories.AddAsync(statusHistory);
            await _context.SaveChangesAsync();

            // ATTACHMENT UPLOAD
            if (request.Attachment != null)
            {
                var imageUrl = await _cloudinaryService.UploadImageAsync(request.Attachment);

                var attachment = new SuggestionAttachment
                {
                    SuggestionId = suggestion.SuggestionId,
                    FilePath = imageUrl,
                    FileName = request.Attachment.FileName,
                    FileType = request.Attachment.ContentType,
                    FileSize = request.Attachment.Length,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                await _context.SuggestionAttachments.AddAsync(attachment);
                await _context.SaveChangesAsync();
            }

            // RESPONSE
            return new SuggestionResponseDto
            {
                SuggestionId = suggestion.SuggestionId,
                SuggestionNumber = suggestion.SuggestionNumber,
                Title = suggestion.Title,
                Description = suggestion.Description,
                ExpectedBenefit = suggestion.ExpectedBenefit,
                StatusName = suggestion.SuggestionStatusMaster.StatusName,
                CreatedDate = suggestion.CreatedAt
            };
        }

        // =====================================================
        // GET CITIZEN SUGGESTIONS
        // =====================================================
        public async Task<List<SuggestionResponseDto>> GetCitizenSuggestionsAsync(int citizenId)
        {
            return await _context.Suggestions
                .Include(x => x.SuggestionStatusMaster)
                .Where(x => x.CitizenId == citizenId)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new SuggestionResponseDto
                {
                    SuggestionId = x.SuggestionId,
                    SuggestionNumber = x.SuggestionNumber,
                    Title = x.Title,
                    Description = x.Description,
                    ExpectedBenefit = x.ExpectedBenefit,
                    StatusName = x.SuggestionStatusMaster.StatusName,
                    CreatedDate = x.CreatedAt
                })
                .ToListAsync();
        }

        // =====================================================
        // GET CATEGORIES
        // =====================================================
        public async Task<List<object>> GetSuggestionCategoriesAsync()
        {
            return await _context.SuggestionCategories
                .Where(x => x.IsActive)
                .OrderBy(x => x.CategoryName)
                .Select(x => new
                {
                    suggestionCategoryId = x.SuggestionCategoryId,
                    categoryName = x.CategoryName
                })
                .Cast<object>()
                .ToListAsync();
        }

        // =====================================================
        // GET ALL SUGGESTIONS
        // =====================================================
        public async Task<List<object>> GetAllSuggestionsAsync()
        {
            return await _context.Suggestions
                .Include(x => x.SuggestionStatusMaster)
                .Include(x => x.SuggestionAttachments)
                .Join(_context.SuggestionCategories,
                    s => s.SuggestionCategoryId,
                    c => c.SuggestionCategoryId,
                    (s, c) => new { s, c })
                .Join(_context.Citizens,
                    sc => sc.s.CitizenId,
                    ct => ct.CitizenId,
                    (sc, ct) => new { sc.s, sc.c, ct })
                .Join(_context.Users,
                    x => x.ct.UserId,
                    u => u.UserId,
                    (x, u) => new
                    {
                        suggestionId = x.s.SuggestionId,
                        suggestionNumber = x.s.SuggestionNumber,
                        title = x.s.Title,
                        description = x.s.Description,
                        status = x.s.SuggestionStatusMaster.StatusName,
                        createdAt = x.s.CreatedAt,
                        citizenId = x.s.CitizenId,
                        isAnonymous = Convert.ToBoolean(x.s.IsAnonymous),
                        citizenName = u.FirstName + " " + u.LastName,
                        wardId = x.s.WardId,
                        categoryName = x.c.CategoryName,
                        totalVotes = x.s.TotalVotes,
                        images = x.s.SuggestionAttachments
                            .Where(a => a.IsActive)
                            .Select(a => a.FilePath)
                            .ToList()
                    })
                .ToListAsync<object>();
        }

        public async Task<List<SuggestionHistoryDto>> GetSuggestionHistoryAsync(int suggestionId)
{
    var history = await _context.SuggestionStatusHistories
    .Where(x => x.SuggestionId == suggestionId)
    .OrderByDescending(x => x.ChangedAt)
    .Select(x => new SuggestionHistoryDto
    {
        OldStatus = x.OldStatus,
        NewStatus = x.NewStatus,
        Remarks = x.Remarks,
        ChangedAt = x.ChangedAt
    })
    .ToListAsync();

return history;
}
    }
}