using CitizenConnect.API.Domain.Entities;
using CitizenConnect.API.DTOs.FacilityFieldOptionDto;
using CitizenConnect.API.Interfaces.Services;
using CitizenConnect.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CitizenConnect.API.Services
{
    public class FacilityFieldOptionService
        : IFacilityFieldOptionService
    {
        private readonly ApplicationDbContext _context;

        public FacilityFieldOptionService(
            ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<FacilityFieldOptionResponseDto>
    CreateAsync(CreateFacilityFieldOptionDto dto)
        {
            var fieldExists =
                await _context.FacilityFields
                    .AnyAsync(x =>
                        x.FacilityFieldId ==
                        dto.FacilityFieldId);

            if (!fieldExists)
            {
                throw new Exception(
                    "Facility Field not found.");
            }

            var option = new FacilityFieldOption
            {
                FacilityFieldId = dto.FacilityFieldId,
                OptionText = dto.OptionText,
                DisplayOrder = dto.DisplayOrder,
                IsActive = true
            };

            _context.FacilityFieldOptions.Add(option);

            await _context.SaveChangesAsync();

            return new FacilityFieldOptionResponseDto
            {
                FacilityFieldOptionId =
                    option.FacilityFieldOptionId,

                FacilityFieldId =
                    option.FacilityFieldId,

                OptionText =
                    option.OptionText,

                DisplayOrder =
                    option.DisplayOrder,

                IsActive =
                    option.IsActive
            };
        }

        public async Task<bool> UpdateAsync(
    UpdateFacilityFieldOptionDto dto)
        {
            var option = await _context.FacilityFieldOptions
                .FirstOrDefaultAsync(x =>
                    x.FacilityFieldOptionId ==
                    dto.FacilityFieldOptionId);

            if (option == null)
            {
                return false;
            }

            option.OptionText = dto.OptionText;
            option.DisplayOrder = dto.DisplayOrder;
            option.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(int optionId)
        {
            var option = await _context.FacilityFieldOptions
                .FirstOrDefaultAsync(x =>
                    x.FacilityFieldOptionId == optionId);

            if (option == null)
            {
                return false;
            }

            option.IsActive = false;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<FacilityFieldOptionResponseDto?>
      GetByIdAsync(int optionId)
        {
            var option = await _context.FacilityFieldOptions
                .FirstOrDefaultAsync(x =>
                    x.FacilityFieldOptionId == optionId &&
                    x.IsActive);

            if (option == null)
            {
                return null;
            }

            return new FacilityFieldOptionResponseDto
            {
                FacilityFieldOptionId =
                    option.FacilityFieldOptionId,

                FacilityFieldId =
                    option.FacilityFieldId,

                OptionText =
                    option.OptionText,

                DisplayOrder =
                    option.DisplayOrder,

                IsActive =
                    option.IsActive
            };
        }

        public async Task<IEnumerable<FacilityFieldOptionResponseDto>>
     GetByFieldIdAsync(int facilityFieldId)
        {
            return await _context.FacilityFieldOptions
                .Where(x =>
                    x.FacilityFieldId == facilityFieldId &&
                    x.IsActive)
                .OrderBy(x => x.DisplayOrder)
                .Select(x =>
                    new FacilityFieldOptionResponseDto
                    {
                        FacilityFieldOptionId =
                            x.FacilityFieldOptionId,

                        FacilityFieldId =
                            x.FacilityFieldId,

                        OptionText =
                            x.OptionText,

                        DisplayOrder =
                            x.DisplayOrder,

                        IsActive =
                            x.IsActive
                    })
                .ToListAsync();
        }
    }
    }
