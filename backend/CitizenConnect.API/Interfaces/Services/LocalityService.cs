using CitizenConnect.API.Domain.Entities;
using CitizenConnect.Application.DTOs.Locality;
using CitizenConnect.Application.Interfaces.Services;
using CitizenConnect.Domain.Entities;
using CitizenConnect.Infrastructure.Data;

using Microsoft.EntityFrameworkCore;

namespace CitizenConnect.Application.Services
{
    public class LocalityService : ILocalityService
    {
        private readonly ApplicationDbContext _context;

        public LocalityService(
            ApplicationDbContext context)
        {
            _context = context;
        }

        // =====================================
        // CREATE LOCALITY
        // =====================================

        public async Task<LocalityResponseDto>
            CreateLocalityAsync(
                LocalityRequestDto dto)
        {
            // =====================================
            // VALIDATE WARD
            // =====================================

            var wardExists =
                await _context.Wards
                    .AnyAsync(x =>
                        x.WardId == dto.WardId);

            if (!wardExists)
            {
                throw new Exception(
                    "Ward not found.");
            }

            // =====================================
            // VALIDATE LOCALITY TYPE
            // =====================================

            var localityTypeExists =
                await _context.LocalityTypes
                    .AnyAsync(x =>
                        x.LocalityTypeId
                        == dto.LocalityTypeId);

            if (!localityTypeExists)
            {
                throw new Exception(
                    "Locality type not found.");
            }

            // =====================================
            // CHECK DUPLICATE LOCALITY
            // =====================================

            var localityExists =
                await _context.Localities
                    .AnyAsync(x =>
                        x.LocalityName
                            .ToLower()
                        == dto.LocalityName
                            .ToLower()
                        &&
                        x.WardId
                        == dto.WardId);

            if (localityExists)
            {
                throw new Exception(
                    "Locality already exists in this ward.");
            }

            // =====================================
            // CREATE ENTITY
            // =====================================

            var locality = new Locality
            {
                LocalityName =
                    dto.LocalityName,

                Description =
                    dto.Description,

                WardId =
                    dto.WardId,

                LocalityTypeId =
                    dto.LocalityTypeId,

                Latitude =
                    dto.Latitude,

                Longitude =
                    dto.Longitude,

                Pincode =
                    dto.Pincode,

                Landmark =
                    dto.Landmark
            };

            await _context.Localities
                .AddAsync(locality);

            await _context.SaveChangesAsync();

            // =====================================
            // FETCH RELATED DATA
            // =====================================

            var ward =
                await _context.Wards
                    .FirstAsync(x =>
                        x.WardId == locality.WardId);

            var localityType =
                await _context.LocalityTypes
                    .FirstAsync(x =>
                        x.LocalityTypeId
                        == locality.LocalityTypeId);

            // =====================================
            // RETURN RESPONSE
            // =====================================

            return new LocalityResponseDto
            {
                LocalityId =
                    locality.LocalityId,

                LocalityName =
                    locality.LocalityName,

                Description =
                    locality.Description,

                WardId =
                    locality.WardId,

                WardName =
                    ward.WardName,

                LocalityTypeId =
                    locality.LocalityTypeId,

                LocalityTypeName =
                    localityType.TypeName,

                Latitude =
                    locality.Latitude,

                Longitude =
                    locality.Longitude,

                Pincode =
                    locality.Pincode,

                Landmark =
                    locality.Landmark
            };
        }

        // =====================================
        // GET ALL LOCALITIES
        // =====================================

        public async Task<List<LocalityResponseDto>>
            GetAllLocalitiesAsync()
        {
            return await _context.Localities
                .Include(x => x.Ward)
                .Include(x => x.LocalityType)
                .Select(x =>
                    new LocalityResponseDto
                    {
                        LocalityId =
                            x.LocalityId,

                        LocalityName =
                            x.LocalityName,

                        Description =
                            x.Description,

                        WardId =
                            x.WardId,

                        WardName =
                            x.Ward.WardName,

                        LocalityTypeId =
                            x.LocalityTypeId,

                        LocalityTypeName =
                            x.LocalityType.TypeName,

                        Latitude =
                            x.Latitude,

                        Longitude =
                            x.Longitude,

                        Pincode =
                            x.Pincode,

                        Landmark =
                            x.Landmark
                    })
                .OrderBy(x => x.LocalityName)
                .ToListAsync();
        }

        // =====================================
        // GET LOCALITY BY ID
        // =====================================

        public async Task<LocalityResponseDto?>
            GetLocalityByIdAsync(
                int localityId)
        {
            return await _context.Localities
                .Include(x => x.Ward)
                .Include(x => x.LocalityType)
                .Where(x =>
                    x.LocalityId == localityId)
                .Select(x =>
                    new LocalityResponseDto
                    {
                        LocalityId =
                            x.LocalityId,

                        LocalityName =
                            x.LocalityName,

                        Description =
                            x.Description,

                        WardId =
                            x.WardId,

                        WardName =
                            x.Ward.WardName,

                        LocalityTypeId =
                            x.LocalityTypeId,

                        LocalityTypeName =
                            x.LocalityType.TypeName,

                        Latitude =
                            x.Latitude,

                        Longitude =
                            x.Longitude,

                        Pincode =
                            x.Pincode,

                        Landmark =
                            x.Landmark
                    })
                .FirstOrDefaultAsync();
        }

        // =====================================
        // UPDATE LOCALITY
        // =====================================

        public async Task<bool>
            UpdateLocalityAsync(
                int localityId,
                LocalityRequestDto dto)
        {
            var locality =
                await _context.Localities
                    .FirstOrDefaultAsync(x =>
                        x.LocalityId
                        == localityId);

            if (locality == null)
            {
                return false;
            }

            locality.LocalityName =
                dto.LocalityName;

            locality.Description =
                dto.Description;

            locality.WardId =
                dto.WardId;

            locality.LocalityTypeId =
                dto.LocalityTypeId;

            locality.Latitude =
                dto.Latitude;

            locality.Longitude =
                dto.Longitude;

            locality.Pincode =
                dto.Pincode;

            locality.Landmark =
                dto.Landmark;

            await _context.SaveChangesAsync();

            return true;
        }

        // =====================================
        // DELETE LOCALITY
        // =====================================

        public async Task<bool>
            DeleteLocalityAsync(
                int localityId)
        {
            var locality =
                await _context.Localities
                    .FirstOrDefaultAsync(x =>
                        x.LocalityId
                        == localityId);

            if (locality == null)
            {
                return false;
            }

            _context.Localities.Remove(locality);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}