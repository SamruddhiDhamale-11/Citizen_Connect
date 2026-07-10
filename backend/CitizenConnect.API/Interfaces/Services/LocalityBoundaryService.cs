using CitizenConnect.API.Domain.Entities;
using CitizenConnect.API.DTOs.LocalityBoundaryDtos;
using CitizenConnect.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CitizenConnect.API.Interfaces.Services
{
    public class LocalityBoundaryService : ILocalityBoundaryService
    {
        private readonly ApplicationDbContext _context;

        public LocalityBoundaryService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task UploadBoundaryAsync(UploadLocalityBoundaryDto dto)
        {
            // Step 1 : Check Locality Exists
            var locality = await _context.Localities
                .FirstOrDefaultAsync(x => x.LocalityId == dto.LocalityId);

            if (locality == null)
            {
                throw new Exception("Locality not found.");
            }

            // Step 2 : Check Existing Boundary
            var existingBoundary = await _context.LocalityBoundaries
                .FirstOrDefaultAsync(x => x.LocalityId == dto.LocalityId);

            if (existingBoundary != null)
            {
                // Update Existing Boundary
                existingBoundary.GeoJson = dto.GeoJson;
                existingBoundary.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                // Create New Boundary
                await _context.LocalityBoundaries.AddAsync(
                    new LocalityBoundary
                    {
                        LocalityId = dto.LocalityId,
                        GeoJson = dto.GeoJson,
                        CreatedAt = DateTime.UtcNow,
                        IsActive = true
                    });
            }

            await _context.SaveChangesAsync();
        }

        public async Task<string?> GetBoundaryGeoJsonAsync(int localityId)
        {
            var boundary = await _context.LocalityBoundaries
                .FirstOrDefaultAsync(x => x.LocalityId == localityId);

            return boundary?.GeoJson;
        }

        public async Task<List<LocalityBoundaryResponseDto>>
    GetBoundariesByWardAsync(int wardId)
        {
            var result =
                await _context.LocalityBoundaries

                    .Include(lb => lb.Locality)

                    .Where(lb =>
                        lb.Locality.WardId == wardId &&
                        lb.IsActive)

                    .Select(lb =>
                        new LocalityBoundaryResponseDto
                        {
                            LocalityBoundaryId =
                                lb.LocalityBoundaryId,

                            LocalityId =
                                lb.LocalityId,

                            LocalityName =
                                lb.Locality.LocalityName,

                            Latitude =
                                lb.Locality.Latitude,

                            Longitude =
                                lb.Locality.Longitude,

                            Pincode =
                                lb.Locality.Pincode,

                            Landmark =
                                lb.Locality.Landmark,

                            GeoJson =
                                lb.GeoJson
                        })

                    .ToListAsync();

            return result;
        }
    }
}