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
            var facilityData = new FacilityData
            {
                FacilityModuleId = dto.FacilityModuleId,
                FacilityFieldId = dto.FacilityFieldId,
                JurisdictionId = dto.JurisdictionId,
                WardId = dto.WardId,
                FieldValue = dto.FieldValue
            };

            _context.FacilityDatas.Add(facilityData);

            await _context.SaveChangesAsync();

            return await GetByIdAsync(
                facilityData.FacilityDataId)
                ?? throw new Exception(
                    "Failed to create Facility Data.");
        }

        public async Task<bool>
    DeleteAsync(int facilityDataId)
        {
            var facilityData = await _context.FacilityDatas
                .FirstOrDefaultAsync(x =>
                    x.FacilityDataId ==
                    facilityDataId);

            if (facilityData == null)
            {
                return false;
            }

            _context.FacilityDatas.Remove(facilityData);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<FacilityDataResponseDto>>
     GetAllAsync()
        {
            return await _context.FacilityDatas
                .Select(x =>
                    new FacilityDataResponseDto
                    {
                        FacilityDataId =
                            x.FacilityDataId,

                        FacilityModuleId =
                            x.FacilityModuleId,

                        FacilityModuleName =
                            x.FacilityModule.ModuleName,

                        FacilityFieldId =
                            x.FacilityFieldId,

                        FacilityFieldName =
                            x.FacilityField.FieldName,

                        JurisdictionId =
                            x.JurisdictionId,

                        JurisdictionName =
                            x.Jurisdiction.JurisdictionName,

                        WardId =
                            x.WardId,

                        WardName =
                            x.Ward != null
                                ? x.Ward.WardName
                                : null,

                        FieldValue =
                            x.FieldValue
                    })
                .ToListAsync();
        }

        public async Task<FacilityDataResponseDto?>
    GetByIdAsync(int facilityDataId)
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

                        FacilityModuleId =
                            x.FacilityModuleId,

                        FacilityModuleName =
                            x.FacilityModule.ModuleName,

                        FacilityFieldId =
                            x.FacilityFieldId,

                        FacilityFieldName =
                            x.FacilityField.FieldName,

                        JurisdictionId =
                            x.JurisdictionId,

                        JurisdictionName =
                            x.Jurisdiction.JurisdictionName,

                        WardId =
                            x.WardId,

                        WardName =
                            x.Ward != null
                                ? x.Ward.WardName
                                : null,

                        FieldValue =
                            x.FieldValue
                    })
                .FirstOrDefaultAsync();
        }

        public Task<IEnumerable<FacilityDataResponseDto>> GetByJurisdictionAsync(int jurisdictionId)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<FacilityDataResponseDto>>
    GetByModuleAsync(
        int facilityModuleId)
        {
            return await _context.FacilityDatas
                .Where(x =>
                    x.FacilityModuleId ==
                    facilityModuleId)
                .Select(x =>
                    new FacilityDataResponseDto
                    {
                        FacilityDataId =
                            x.FacilityDataId,

                        FacilityModuleId =
                            x.FacilityModuleId,

                        FacilityModuleName =
                            x.FacilityModule.ModuleName,

                        FacilityFieldId =
                            x.FacilityFieldId,

                        FacilityFieldName =
                            x.FacilityField.FieldName,

                        JurisdictionId =
                            x.JurisdictionId,

                        JurisdictionName =
                            x.Jurisdiction.JurisdictionName,

                        WardId =
                            x.WardId,

                        WardName =
                            x.Ward != null
                                ? x.Ward.WardName
                                : null,

                        FieldValue =
                            x.FieldValue
                    })
                .ToListAsync();
        }

        public async Task<bool>
     UpdateAsync(UpdateFacilityDataDto dto)
        {
            var facilityData = await _context.FacilityDatas
                .FirstOrDefaultAsync(x =>
                    x.FacilityDataId ==
                    dto.FacilityDataId);

            if (facilityData == null)
            {
                return false;
            }

            facilityData.FacilityModuleId =
                dto.FacilityModuleId;

            facilityData.FacilityFieldId =
                dto.FacilityFieldId;

            facilityData.JurisdictionId =
                dto.JurisdictionId;

            facilityData.WardId =
                dto.WardId;

            facilityData.FieldValue =
                dto.FieldValue;

            await _context.SaveChangesAsync();

            return true;
        }

    }
}
           