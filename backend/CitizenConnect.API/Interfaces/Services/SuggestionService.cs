using CitizenConnect.API.Domain.Enums;
using CitizenConnect.Application.DTOs.Suggestion;
using CitizenConnect.Application.Interfaces.Services;
using CitizenConnect.Domain.Entities;
using CitizenConnect.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;

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

                ExpectedBenefit =
                    suggestion.ExpectedBenefit,

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

                        ExpectedBenefit =
                            x.ExpectedBenefit,

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
        .Where(x => x.IsActive)
        .OrderBy(x => x.CategoryName)
        .Select(x => new
        {
            suggestionCategoryId =
                x.SuggestionCategoryId,

            categoryName =
                x.CategoryName
        })
        .Cast<object>()
        .ToListAsync();
}

public async Task<List<object>> GetAllSuggestionsAsync()
{
    return await _context.Suggestions

        .Join(
            _context.SuggestionCategories,

            s => s.SuggestionCategoryId,

            c => c.SuggestionCategoryId,

            (s, c) => new
            {
                s,
                c
            }
        )

        .Join(
            _context.Citizens,

            sc => sc.s.CitizenId,

            ct => ct.CitizenId,

            (sc, ct) => new
            {
                sc.s,
                sc.c,
                ct
            }
        )

        .Join(
            _context.Users,

            x => x.ct.UserId,

            u => u.UserId,

            (x, u) => new
            {
                suggestionId =
                    x.s.SuggestionId,

                suggestionNumber =
                    x.s.SuggestionNumber,

                title =
                    x.s.Title,

                description =
                    x.s.Description,

                status =
                    x.s.Status.ToString(),

                createdAt =
                    x.s.CreatedAt,

                citizenId =
                    x.s.CitizenId,

                citizenName =
                    u.FirstName + " " + u.LastName,

                wardId =
                    x.s.WardId,

                categoryName =
                    x.c.CategoryName,

                totalVotes =
                    x.s.TotalVotes
            }
        )

        .ToListAsync<object>();
}

    }
}