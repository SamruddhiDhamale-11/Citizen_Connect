using CitizenConnect.API.Domain.Entities;
using CitizenConnect.API.DTOs.JurisdictionDto;
using CitizenConnect.API.Interfaces.Services;
using CitizenConnect.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CitizenConnect.API.Services
{
    public class JurisdictionService
        : IJurisdictionService
    {
        private readonly ApplicationDbContext _context;

        public JurisdictionService(
            ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<JurisdictionResponseDto>
    CreateAsync(CreateJurisdictionDto dto)
        {
            var jurisdiction = new Jurisdiction
            {
                JurisdictionName = dto.JurisdictionName,
                JurisdictionTypeId = dto.JurisdictionTypeId,
                Address = dto.Address,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                Pincode = dto.Pincode,
                IsActive = true
            };

            _context.Jurisdictions.Add(jurisdiction);

            await _context.SaveChangesAsync();

            return new JurisdictionResponseDto
            {
                JurisdictionId = jurisdiction.JurisdictionId,
                JurisdictionName = jurisdiction.JurisdictionName,
                JurisdictionTypeId = jurisdiction.JurisdictionTypeId,
                Address = jurisdiction.Address,
                Latitude = jurisdiction.Latitude,
                Longitude = jurisdiction.Longitude,
                Pincode = jurisdiction.Pincode,
                IsActive = jurisdiction.IsActive
            };
        }

        public async Task<bool> UpdateAsync(
    UpdateJurisdictionDto dto)
        {
            var jurisdiction = await _context.Jurisdictions
                .FirstOrDefaultAsync(x =>
                    x.JurisdictionId == dto.JurisdictionId);

            if (jurisdiction == null)
            {
                return false;
            }

            jurisdiction.JurisdictionName = dto.JurisdictionName;
            jurisdiction.JurisdictionTypeId = dto.JurisdictionTypeId;
            jurisdiction.Address = dto.Address;
            jurisdiction.Latitude = dto.Latitude;
            jurisdiction.Longitude = dto.Longitude;
            jurisdiction.Pincode = dto.Pincode;
            jurisdiction.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(
    int jurisdictionId)
        {
            var jurisdiction = await _context.Jurisdictions
                .FirstOrDefaultAsync(x =>
                    x.JurisdictionId == jurisdictionId);

            if (jurisdiction == null)
            {
                return false;
            }

            jurisdiction.IsActive = false;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<JurisdictionResponseDto?>
    GetByIdAsync(int jurisdictionId)
        {
            return await _context.Jurisdictions
                .Where(x =>
                    x.JurisdictionId == jurisdictionId)
                .Select(x =>
                    new JurisdictionResponseDto
                    {
                        JurisdictionId =
                            x.JurisdictionId,

                        JurisdictionName =
                            x.JurisdictionName,

                        JurisdictionTypeId =
                            x.JurisdictionTypeId,

                        JurisdictionTypeName =
                            x.JurisdictionType
                                .JurisdictionTypeName,

                        Address =
                            x.Address,

                        Latitude =
                            x.Latitude,

                        Longitude =
                            x.Longitude,

                        Pincode =
                            x.Pincode,

                        IsActive =
                            x.IsActive
                    })
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<JurisdictionResponseDto>>
    GetAllAsync()
        {
            return await _context.Jurisdictions
                .Where(x => x.IsActive)
                .OrderBy(x => x.JurisdictionName)
                .Select(x =>
                    new JurisdictionResponseDto
                    {
                        JurisdictionId =
                            x.JurisdictionId,

                        JurisdictionName =
                            x.JurisdictionName,

                        JurisdictionTypeId =
                            x.JurisdictionTypeId,

                        JurisdictionTypeName =
                            x.JurisdictionType
                                .JurisdictionTypeName,

                        Address =
                            x.Address,

                        Latitude =
                            x.Latitude,

                        Longitude =
                            x.Longitude,

                        Pincode =
                            x.Pincode,

                        IsActive =
                            x.IsActive
                    })
                .ToListAsync();
        }
    }
}