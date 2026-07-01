using CitizenConnect.API.Domain.Entities;
using CitizenConnect.API.DTOs.FacilityFieldOptionDto;
using CitizenConnect.API.DTOs.FacilityRecordDto;
using CitizenConnect.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CitizenConnect.API.Interfaces.Services
{
    public class FacilityRecordService
        : IFacilityRecordService
    {
        private readonly ApplicationDbContext _context;

        public FacilityRecordService(
            ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<FacilityRecordDto>
            CreateAsync(
                CreateFacilityRecordDto dto)
        {
            var entity = new FacilityRecord
            {
                FacilityModuleId =
                    dto.FacilityModuleId,

                JurisdictionId =
                    dto.JurisdictionId,

                WardId =
                    dto.WardId,

                IsActive = true
            };

            _context.FacilityRecords.Add(entity);

            await _context.SaveChangesAsync();

            return await GetByIdAsync(
                entity.FacilityRecordId)
                ?? throw new Exception(
                    "Facility Record creation failed.");
        }

        public async Task<FacilityRecordDto>
            CreateWithDataAsync(
                CreateFacilityRecordWithDataDto dto)
        {
            using var transaction =
                await _context.Database
                    .BeginTransactionAsync();

            var record = new FacilityRecord
            {
                FacilityModuleId =
                    dto.FacilityModuleId,

                JurisdictionId =
                    dto.JurisdictionId,

                WardId =
                    dto.WardId,

                IsActive = true
            };

            _context.FacilityRecords.Add(record);

            await _context.SaveChangesAsync();

            foreach (var field in dto.Fields)
            {
                _context.FacilityDatas.Add(
                    new FacilityData
                    {
                        FacilityRecordId =
                            record.FacilityRecordId,

                        FacilityFieldId =
                            field.FacilityFieldId,

                        FieldValue =
                            field.FieldValue
                    });
            }

            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            return await GetByIdAsync(
                record.FacilityRecordId)
                ?? throw new Exception(
                    "Facility Record creation failed.");
        }

        public async Task<
            IEnumerable<FacilityRecordDto>>
            GetAllAsync()
        {
            return await _context.FacilityRecords
                .Select(x =>
                    new FacilityRecordDto
                    {
                        FacilityRecordId =
                            x.FacilityRecordId,

                        FacilityModuleId =
                            x.FacilityModuleId,

                        FacilityModuleName =
                            x.FacilityModule
                                .ModuleName,

                        JurisdictionId =
                            x.JurisdictionId,

                        JurisdictionName =
                            x.Jurisdiction
                                .JurisdictionName,

                        WardId =
                            x.WardId,

                        WardName =
                            x.Ward != null
                                ? x.Ward.WardName
                                : null,

                        IsActive =
                            x.IsActive
                    })
                .ToListAsync();
        }

        public async Task<FacilityRecordDto?>
            GetByIdAsync(
                int facilityRecordId)
        {
            return await _context.FacilityRecords
                .Where(x =>
                    x.FacilityRecordId ==
                    facilityRecordId)
                .Select(x =>
                    new FacilityRecordDto
                    {
                        FacilityRecordId =
                            x.FacilityRecordId,

                        FacilityModuleId =
                            x.FacilityModuleId,

                        FacilityModuleName =
                            x.FacilityModule
                                .ModuleName,

                        JurisdictionId =
                            x.JurisdictionId,

                        JurisdictionName =
                            x.Jurisdiction
                                .JurisdictionName,

                        WardId =
                            x.WardId,

                        WardName =
                            x.Ward != null
                                ? x.Ward.WardName
                                : null,

                        IsActive =
                            x.IsActive
                    })
                .FirstOrDefaultAsync();
        }

        public async Task<
            IEnumerable<FacilityRecordDto>>
            GetByModuleAsync(
                int facilityModuleId)
        {
            return await _context.FacilityRecords
                .Where(x =>
                    x.FacilityModuleId ==
                    facilityModuleId)
                .Select(x =>
                    new FacilityRecordDto
                    {
                        FacilityRecordId =
                            x.FacilityRecordId,

                        FacilityModuleId =
                            x.FacilityModuleId,

                        FacilityModuleName =
                            x.FacilityModule
                                .ModuleName,

                        JurisdictionId =
                            x.JurisdictionId,

                        JurisdictionName =
                            x.Jurisdiction
                                .JurisdictionName,

                        WardId =
                            x.WardId,

                        WardName =
                            x.Ward != null
                                ? x.Ward.WardName
                                : null,

                        IsActive =
                            x.IsActive
                    })
                .ToListAsync();
        }

        public async Task<
            IEnumerable<FacilityRecordDto>>
            GetByJurisdictionAsync(
                int jurisdictionId)
        {
            return await _context.FacilityRecords
                .Where(x =>
                    x.JurisdictionId ==
                    jurisdictionId)
                .Select(x =>
                    new FacilityRecordDto
                    {
                        FacilityRecordId =
                            x.FacilityRecordId,

                        FacilityModuleId =
                            x.FacilityModuleId,

                        FacilityModuleName =
                            x.FacilityModule
                                .ModuleName,

                        JurisdictionId =
                            x.JurisdictionId,

                        JurisdictionName =
                            x.Jurisdiction
                                .JurisdictionName,

                        WardId =
                            x.WardId,

                        WardName =
                            x.Ward != null
                                ? x.Ward.WardName
                                : null,

                        IsActive =
                            x.IsActive
                    })
                .ToListAsync();
        }

        public async Task<
            IEnumerable<FacilityRecordDto>>
            GetByWardAsync(
                int wardId)
        {
            return await _context.FacilityRecords
                .Where(x =>
                    x.WardId == wardId)
                .Select(x =>
                    new FacilityRecordDto
                    {
                        FacilityRecordId =
                            x.FacilityRecordId,

                        FacilityModuleId =
                            x.FacilityModuleId,

                        FacilityModuleName =
                            x.FacilityModule
                                .ModuleName,

                        JurisdictionId =
                            x.JurisdictionId,

                        JurisdictionName =
                            x.Jurisdiction
                                .JurisdictionName,

                        WardId =
                            x.WardId,

                        WardName =
                            x.Ward != null
                                ? x.Ward.WardName
                                : null,

                        IsActive =
                            x.IsActive
                    })
                .ToListAsync();
        }

        public async Task<bool>
            UpdateAsync(
                UpdateFacilityRecordDto dto)
        {
            var entity =
                await _context.FacilityRecords
                    .FirstOrDefaultAsync(x =>
                        x.FacilityRecordId ==
                        dto.FacilityRecordId);

            if (entity == null)
                return false;

            entity.FacilityModuleId =
                dto.FacilityModuleId;

            entity.JurisdictionId =
                dto.JurisdictionId;

            entity.WardId =
                dto.WardId;

            entity.IsActive =
                dto.IsActive;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool>
            DeleteAsync(
                int facilityRecordId)
        {
            var entity =
                await _context.FacilityRecords
                    .FirstOrDefaultAsync(x =>
                        x.FacilityRecordId ==
                        facilityRecordId);

            if (entity == null)
                return false;

            entity.IsActive = false;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<FacilityRecordDetailsDto?>
     GetDetailsAsync(int facilityRecordId)
        {
            var record = await _context.FacilityRecords
                .Include(x => x.FacilityModule)
                .Include(x => x.Jurisdiction)
                .Include(x => x.Ward)
                .FirstOrDefaultAsync(x =>
                    x.FacilityRecordId == facilityRecordId);

            if (record == null)
            {
                return null;
            }

            var fieldValues = await _context.FacilityDatas
    .Where(x => x.FacilityRecordId == facilityRecordId)
    .Include(x => x.FacilityField)
        .ThenInclude(x => x.FacilityFieldOptions)
    .ToListAsync();

            // We will continue here in the next step.

            return new FacilityRecordDetailsDto
            {
                FacilityRecordId = record.FacilityRecordId,

                FacilityModuleId = record.FacilityModuleId,

                FacilityModuleName = record.FacilityModule.ModuleName,

                JurisdictionId = record.JurisdictionId,

                JurisdictionName = record.Jurisdiction.JurisdictionName,

                WardId = record.WardId,

                WardName = record.Ward?.WardName,

                IsActive = record.IsActive,

                Fields = fieldValues.Select(x => new FacilityFieldDetailsDto
                {
                    FacilityFieldId = x.FacilityFieldId,

                    FieldName = x.FacilityField.FieldName,

                    FieldType = x.FacilityField.FieldType,

                    IsRequired = x.FacilityField.IsRequired,

                    Placeholder = x.FacilityField.Placeholder,

                    FieldValue = x.FieldValue,

                    Options = x.FacilityField.FacilityFieldOptions
                        .Where(o => o.IsActive)
                        .OrderBy(o => o.DisplayOrder)
                        .Select(o => new FacilityFieldOptionResponseDto
                        {
                            FacilityFieldOptionId = o.FacilityFieldOptionId,
                            FacilityFieldId = o.FacilityFieldId,
                            OptionText = o.OptionText,
                            DisplayOrder = o.DisplayOrder,
                            IsActive = o.IsActive
                        })
                        .ToList()

                }).ToList()
            };
        }
    }
}
