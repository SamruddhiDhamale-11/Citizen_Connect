using CitizenConnect.API.Domain.Entities;
using CitizenConnect.API.DTOs.FacilityFieldOptionDto;
using CitizenConnect.Application.DTOs.Facility;
using CitizenConnect.Application.Services.Interfaces;
using CitizenConnect.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CitizenConnect.Application.Services
{
    public class FacilityFieldService : IFacilityFieldService
    {
        private readonly ApplicationDbContext _context;

        public FacilityFieldService(
            ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<FacilityFieldResponseDto> CreateAsync(
            CreateFacilityFieldDto dto)
        {
            var moduleExists = await _context.FacilityModules
                .AnyAsync(x =>
                    x.FacilityModuleId ==
                    dto.FacilityModuleId);

            if (!moduleExists)
            {
                throw new Exception(
                    "Facility Module not found.");
            }

            var field = new FacilityField
            {
                FacilityModuleId = dto.FacilityModuleId,
                FieldName = dto.FieldName,
                FieldType = dto.FieldType,
                IsRequired = dto.IsRequired,
                DisplayOrder = dto.DisplayOrder,
                Placeholder = dto.Placeholder,
                IsActive = true
            };

            _context.FacilityFields.Add(field);

            await _context.SaveChangesAsync();

            return new FacilityFieldResponseDto
            {
                FacilityFieldId = field.FacilityFieldId,
                FacilityModuleId = field.FacilityModuleId,
                FieldName = field.FieldName,
                FieldType = field.FieldType,
                IsRequired = field.IsRequired,
                DisplayOrder = field.DisplayOrder,
                Placeholder = field.Placeholder,
                IsActive = field.IsActive
            };
        }

        public async Task<FacilityFieldResponseDto?> GetByIdAsync(
            int facilityFieldId)
        {
            return await _context.FacilityFields
                .Where(x =>
                    x.FacilityFieldId ==
                    facilityFieldId)
                .Select(x =>
                    new FacilityFieldResponseDto
                    {
                        FacilityFieldId =
                            x.FacilityFieldId,

                        FacilityModuleId =
                            x.FacilityModuleId,

                        FieldName =
                            x.FieldName,

                        FieldType =
                            x.FieldType,

                        IsRequired =
                            x.IsRequired,

                        DisplayOrder =
                            x.DisplayOrder,

                        Placeholder =
                            x.Placeholder,

                        IsActive =
                            x.IsActive
                    })
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<FacilityFieldResponseDto>>
      GetByModuleIdAsync(int facilityModuleId)
        {
            return await _context.FacilityFields
                .Where(x =>
                    x.FacilityModuleId == facilityModuleId &&
                    x.IsActive)
                .OrderBy(x => x.DisplayOrder)
                .Select(x =>
                    new FacilityFieldResponseDto
                    {
                        FacilityFieldId =
                            x.FacilityFieldId,

                        FacilityModuleId =
                            x.FacilityModuleId,

                        FieldName =
                            x.FieldName,

                        FieldType =
                            x.FieldType,

                        IsRequired =
                            x.IsRequired,

                        DisplayOrder =
                            x.DisplayOrder,

                        Placeholder =
                            x.Placeholder,

                        IsActive =
                            x.IsActive,

                        Options =
                            x.FacilityFieldOptions
                                .Where(o => o.IsActive)
                                .OrderBy(o => o.DisplayOrder)
                                .Select(o =>
                                    new FacilityFieldOptionResponseDto
                                    {
                                        FacilityFieldOptionId =
                                            o.FacilityFieldOptionId,

                                        FacilityFieldId =
                                            o.FacilityFieldId,

                                        OptionText =
                                            o.OptionText,

                                        DisplayOrder =
                                            o.DisplayOrder,

                                        IsActive =
                                            o.IsActive
                                    })
                                .ToList()
                    })
                .ToListAsync();
        }

        public async Task<bool> UpdateAsync(
            UpdateFacilityFieldDto dto)
        {
            var field = await _context.FacilityFields
                .FirstOrDefaultAsync(x =>
                    x.FacilityFieldId ==
                    dto.FacilityFieldId);

            if (field == null)
                return false;

            field.FacilityModuleId =
                dto.FacilityModuleId;

            field.FieldName =
                dto.FieldName;

            field.FieldType =
                dto.FieldType;

            field.IsRequired =
                dto.IsRequired;

            field.DisplayOrder =
                dto.DisplayOrder;

            field.Placeholder =
                dto.Placeholder;

            field.IsActive =
                dto.IsActive;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(
            int facilityFieldId)
        {
            var field = await _context.FacilityFields
                .FirstOrDefaultAsync(x =>
                    x.FacilityFieldId ==
                    facilityFieldId);

            if (field == null)
                return false;

            // Soft Delete
            field.IsActive = false;

            await _context.SaveChangesAsync();

            return true;
        }
    }
}