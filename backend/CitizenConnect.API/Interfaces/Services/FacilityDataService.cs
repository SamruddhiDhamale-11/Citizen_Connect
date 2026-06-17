using CitizenConnect.API.Domain.Entities;
using CitizenConnect.API.DTOs.FacilityDataDto;
using CitizenConnect.API.Interfaces.Services;
using CitizenConnect.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CitizenConnect.API.Services
{
    public class FacilityDataService : IFacilityDataService
    {
        private readonly ApplicationDbContext _context;

        public FacilityDataService(
            ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<FacilityDataResponseDto>
            CreateAsync(CreateFacilityDataDto dto)
        {
            var recordExists =
                await _context.FacilityRecords
                    .AnyAsync(x =>
                        x.FacilityRecordId ==
                        dto.FacilityRecordId);

            if (!recordExists)
            {
                throw new Exception(
                    "Facility Record not found.");
            }

            var facilityData = new FacilityData
            {
                FacilityRecordId =
                    dto.FacilityRecordId,

                FacilityFieldId =
                    dto.FacilityFieldId,

                FieldValue =
                    dto.FieldValue
            };

            _context.FacilityDatas.Add(
                facilityData);

            await _context.SaveChangesAsync();

            return await GetByIdAsync(
                facilityData.FacilityDataId)
                ?? throw new Exception(
                    "Failed to create Facility Data.");
        }

        public async Task<IEnumerable<
            FacilityDataResponseDto>>
            GetAllAsync()
        {
            return await _context.FacilityDatas
                .Select(x =>
                    new FacilityDataResponseDto
                    {
                        FacilityDataId =
                            x.FacilityDataId,

                        FacilityRecordId =
                            x.FacilityRecordId,

                        FacilityModuleId =
                            x.FacilityRecord
                                .FacilityModuleId,

                        FacilityModuleName =
                            x.FacilityRecord
                                .FacilityModule
                                .ModuleName,

                        FacilityFieldId =
                            x.FacilityFieldId,

                        FacilityFieldName =
                            x.FacilityField
                                .FieldName,

                        JurisdictionId =
                            x.FacilityRecord
                                .JurisdictionId,

                        JurisdictionName =
                            x.FacilityRecord
                                .Jurisdiction
                                .JurisdictionName,

                        WardId =
                            x.FacilityRecord
                                .WardId,

                        WardName =
                            x.FacilityRecord
                                .Ward != null
                                    ? x.FacilityRecord
                                        .Ward
                                        .WardName
                                    : null,

                        FieldValue =
                            x.FieldValue
                    })
                .ToListAsync();
        }

        public async Task<
            FacilityDataResponseDto?>
            GetByIdAsync(
                int facilityDataId)
        {
            return await _context.FacilityDatas
                .Where(x =>
                    x.FacilityDataId ==
                    facilityDataId)
                .Select(x =>
                    new FacilityDataResponseDto
                    {
                        FacilityDataId =
                            x.FacilityDataId,

                        FacilityRecordId =
                            x.FacilityRecordId,

                        FacilityModuleId =
                            x.FacilityRecord
                                .FacilityModuleId,

                        FacilityModuleName =
                            x.FacilityRecord
                                .FacilityModule
                                .ModuleName,

                        FacilityFieldId =
                            x.FacilityFieldId,

                        FacilityFieldName =
                            x.FacilityField
                                .FieldName,

                        JurisdictionId =
                            x.FacilityRecord
                                .JurisdictionId,

                        JurisdictionName =
                            x.FacilityRecord
                                .Jurisdiction
                                .JurisdictionName,

                        WardId =
                            x.FacilityRecord
                                .WardId,

                        WardName =
                            x.FacilityRecord
                                .Ward != null
                                    ? x.FacilityRecord
                                        .Ward
                                        .WardName
                                    : null,

                        FieldValue =
                            x.FieldValue
                    })
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<
            FacilityDataResponseDto>>
            GetByModuleAsync(
                int facilityModuleId)
        {
            return await _context.FacilityDatas
                .Where(x =>
                    x.FacilityRecord
                        .FacilityModuleId ==
                    facilityModuleId)
                .Select(x =>
                    new FacilityDataResponseDto
                    {
                        FacilityDataId =
                            x.FacilityDataId,

                        FacilityRecordId =
                            x.FacilityRecordId,

                        FacilityModuleId =
                            x.FacilityRecord
                                .FacilityModuleId,

                        FacilityModuleName =
                            x.FacilityRecord
                                .FacilityModule
                                .ModuleName,

                        FacilityFieldId =
                            x.FacilityFieldId,

                        FacilityFieldName =
                            x.FacilityField
                                .FieldName,

                        JurisdictionId =
                            x.FacilityRecord
                                .JurisdictionId,

                        JurisdictionName =
                            x.FacilityRecord
                                .Jurisdiction
                                .JurisdictionName,

                        WardId =
                            x.FacilityRecord
                                .WardId,

                        WardName =
                            x.FacilityRecord
                                .Ward != null
                                    ? x.FacilityRecord
                                        .Ward
                                        .WardName
                                    : null,

                        FieldValue =
                            x.FieldValue
                    })
                .ToListAsync();
        }

        public async Task<IEnumerable<
            FacilityDataResponseDto>>
            GetByJurisdictionAsync(
                int jurisdictionId)
        {
            return await _context.FacilityDatas
                .Where(x =>
                    x.FacilityRecord
                        .JurisdictionId ==
                    jurisdictionId)
                .Select(x =>
                    new FacilityDataResponseDto
                    {
                        FacilityDataId =
                            x.FacilityDataId,

                        FacilityRecordId =
                            x.FacilityRecordId,

                        FacilityModuleId =
                            x.FacilityRecord
                                .FacilityModuleId,

                        FacilityModuleName =
                            x.FacilityRecord
                                .FacilityModule
                                .ModuleName,

                        FacilityFieldId =
                            x.FacilityFieldId,

                        FacilityFieldName =
                            x.FacilityField
                                .FieldName,

                        JurisdictionId =
                            x.FacilityRecord
                                .JurisdictionId,

                        JurisdictionName =
                            x.FacilityRecord
                                .Jurisdiction
                                .JurisdictionName,

                        WardId =
                            x.FacilityRecord
                                .WardId,

                        WardName =
                            x.FacilityRecord
                                .Ward != null
                                    ? x.FacilityRecord
                                        .Ward
                                        .WardName
                                    : null,

                        FieldValue =
                            x.FieldValue
                    })
                .ToListAsync();
        }

        public async Task<bool>
            UpdateAsync(
                UpdateFacilityDataDto dto)
        {
            var facilityData =
                await _context.FacilityDatas
                    .FirstOrDefaultAsync(x =>
                        x.FacilityDataId ==
                        dto.FacilityDataId);

            if (facilityData == null)
            {
                return false;
            }

            facilityData.FieldValue =
                dto.FieldValue;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool>
            DeleteAsync(
                int facilityDataId)
        {
            var facilityData =
                await _context.FacilityDatas
                    .FirstOrDefaultAsync(x =>
                        x.FacilityDataId ==
                        facilityDataId);

            if (facilityData == null)
            {
                return false;
            }

            _context.FacilityDatas
                .Remove(facilityData);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<FacilityDataResponseDto>>
    GetByRecordAsync(int facilityRecordId)
        {
            return await _context.FacilityDatas
                .Where(x =>
                    x.FacilityRecordId ==
                    facilityRecordId)
                .Select(x =>
                    new FacilityDataResponseDto
                    {
                        FacilityDataId =
                            x.FacilityDataId,

                        FacilityRecordId =
                            x.FacilityRecordId,

                        FacilityModuleId =
                            x.FacilityRecord
                                .FacilityModuleId,

                        FacilityModuleName =
                            x.FacilityRecord
                                .FacilityModule
                                .ModuleName,

                        FacilityFieldId =
                            x.FacilityFieldId,

                        FacilityFieldName =
                            x.FacilityField
                                .FieldName,

                        JurisdictionId =
                            x.FacilityRecord
                                .JurisdictionId,

                        JurisdictionName =
                            x.FacilityRecord
                                .Jurisdiction
                                .JurisdictionName,

                        WardId =
                            x.FacilityRecord
                                .WardId,

                        WardName =
                            x.FacilityRecord.Ward != null
                                ? x.FacilityRecord.Ward.WardName
                                : null,

                        FieldValue =
                            x.FieldValue
                    })
                .ToListAsync();
        }

        public async Task<IEnumerable<FacilityDataResponseDto>>
    GetByWardAsync(int wardId)
        {
            return await _context.FacilityDatas
                .Where(x =>
                    x.FacilityRecord.WardId ==
                    wardId)
                .Select(x =>
                    new FacilityDataResponseDto
                    {
                        FacilityDataId =
                            x.FacilityDataId,

                        FacilityRecordId =
                            x.FacilityRecordId,

                        FacilityModuleId =
                            x.FacilityRecord
                                .FacilityModuleId,

                        FacilityModuleName =
                            x.FacilityRecord
                                .FacilityModule
                                .ModuleName,

                        FacilityFieldId =
                            x.FacilityFieldId,

                        FacilityFieldName =
                            x.FacilityField
                                .FieldName,

                        JurisdictionId =
                            x.FacilityRecord
                                .JurisdictionId,

                        JurisdictionName =
                            x.FacilityRecord
                                .Jurisdiction
                                .JurisdictionName,

                        WardId =
                            x.FacilityRecord
                                .WardId,

                        WardName =
                            x.FacilityRecord.Ward != null
                                ? x.FacilityRecord.Ward.WardName
                                : null,

                        FieldValue =
                            x.FieldValue
                    })
                .ToListAsync();
        }
    }
}
           