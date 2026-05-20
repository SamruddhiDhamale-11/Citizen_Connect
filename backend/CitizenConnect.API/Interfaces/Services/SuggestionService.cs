using CitizenConnect.API.Domain.Enums;
using CitizenConnect.Application.DTOs.Suggestion;
using CitizenConnect.Application.Interfaces.Services;
using CitizenConnect.Domain.Entities;
using CitizenConnect.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CitizenConnect.Application.Services
{
    public class SuggestionService
        : ISuggestionService
    {
        private readonly ApplicationDbContext
            _context;

        public SuggestionService(
            ApplicationDbContext context)
        {
            _context = context;
        }


        /**
         * =====================================================
         * CREATE SUGGESTION
         * =====================================================
         */

        public async Task<SuggestionResponseDto>
            CreateSuggestionAsync(
                int citizenId,
                int wardId,
                CreateSuggestionRequestDto request)
        {
            /**
             * ===============================================
             * VALIDATE CATEGORY
             * ===============================================
             */

            var categoryExists =
                await _context
                .SuggestionCategories
                .AnyAsync(x =>

                    x.SuggestionCategoryId ==
                    request.SuggestionCategoryId
                );

            if (!categoryExists)
            {
                throw new Exception(
                    "Invalid suggestion category."
                );
            }


            /**
             * ===============================================
             * GENERATE SUGGESTION NUMBER
             * ===============================================
             */

            var suggestionNumber =
                $"SG-{DateTime.UtcNow:yyyyMMddHHmmss}";


            /**
             * ===============================================
             * CREATE ENTITY
             * ===============================================
             */

            var suggestion =
                new Suggestion
                {
                    SuggestionNumber =
                        suggestionNumber,

                    CitizenId =
                        citizenId,

                    WardId =
                        wardId,

                    SuggestionCategoryId =
                        request.SuggestionCategoryId,

                    Title =
                        request.Title,

                    Description =
                        request.Description,

                    ExpectedBenefit =
                        request.ExpectedBenefit,

                    BenefitScope =
                        request.BenefitScope,

                    IsAnonymous =
                        request.IsAnonymous,

                    Status =
                        SuggestionStatus.Pending,

                    TotalVotes = 0,

                    CreatedAt =
                        DateTime.UtcNow
                };


            /**
             * ===============================================
             * SAVE TO DATABASE
             * ===============================================
             */

            await _context
                .Suggestions
                .AddAsync(suggestion);

            await _context
                .SaveChangesAsync();


            /**
             * ===============================================
             * CREATE STATUS HISTORY
             * ===============================================
             */

            var statusHistory =
                new SuggestionStatusHistory
                {
                    SuggestionId =
                        suggestion.SuggestionId,

                    OldStatus =
                        SuggestionStatus.Pending,

                    NewStatus =
                        SuggestionStatus.Pending,

                    ChangedByUserId =
                        citizenId,

                    Remarks =
                        "Suggestion created.",

                    ChangedAt =
                        DateTime.UtcNow
                };

            await _context
                .SuggestionStatusHistories
                .AddAsync(statusHistory);

            await _context
                .SaveChangesAsync();


            /**
             * ===============================================
             * RETURN RESPONSE
             * ===============================================
             */

            var categoryName =
                await _context
                .SuggestionCategories
                .Where(c =>
                    c.SuggestionCategoryId ==
                    suggestion.SuggestionCategoryId)
                .Select(c => c.CategoryName)
                .FirstOrDefaultAsync()
                ?? string.Empty;

            return new SuggestionResponseDto
            {
                SuggestionId =
                    suggestion.SuggestionId,

                SuggestionNumber =
                    suggestion.SuggestionNumber,

                Title =
                    suggestion.Title,

                Description =
                    suggestion.Description,

                CategoryName =
                    categoryName,

                ExpectedBenefit =
                    suggestion.ExpectedBenefit,

                BenefitScopeDisplay =
                    suggestion.BenefitScope.ToString(),

                Status =
                    suggestion.Status,

                CreatedDate =
                    suggestion.CreatedAt
            };
        }


        /**
         * =====================================================
         * GET CITIZEN SUGGESTIONS
         * =====================================================
         */

        public async Task<
            List<SuggestionResponseDto>>
            GetCitizenSuggestionsAsync(
                int citizenId)
        {
            var suggestions =
                await _context
                .Suggestions
                .Include(x => x.SuggestionCategory)
                .Where(x =>

                    x.CitizenId ==
                    citizenId
                )
                .OrderByDescending(x =>

                    x.CreatedAt
                )
                .Select(x =>

                    new SuggestionResponseDto
                    {
                        SuggestionId =
                            x.SuggestionId,

                        SuggestionNumber =
                            x.SuggestionNumber,

                        Title =
                            x.Title,

                        Description =
                            x.Description,

                        CategoryName =
                            x.SuggestionCategory.CategoryName,

                        ExpectedBenefit =
                            x.ExpectedBenefit,

                        BenefitScopeDisplay =
                            x.BenefitScope.ToString(),

                        Status =
                            x.Status,

                        CreatedDate =
                            x.CreatedAt
                    }

                )
                .ToListAsync();

            return suggestions;
        }


        /**
         * =====================================================
         * GET SUGGESTION CATEGORIES
         * =====================================================
         */

        public async Task<List<object>>
            GetSuggestionCategoriesAsync()
        {
            return await _context
                .SuggestionCategories
                .Where(c => c.IsActive)
                .OrderBy(c => c.CategoryName)
                .Select(c => new
                {
                    c.SuggestionCategoryId,
                    c.CategoryName
                })
                .Cast<object>()
                .ToListAsync();
        }
    }
}