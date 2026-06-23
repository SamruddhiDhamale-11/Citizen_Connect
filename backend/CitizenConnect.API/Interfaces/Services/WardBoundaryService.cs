using CitizenConnect.API.DTOs.WardBoundary;
using CitizenConnect.Domain.Entities;
using CitizenConnect.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CitizenConnect.API.Interfaces.Services
{
    public class WardBoundaryService:IWardBoundaryService
    {
        private readonly ApplicationDbContext _context;

        public WardBoundaryService(
            ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task UploadBoundaryAsync(
            UploadWardBoundaryDto dto)
        {
            var ward =
                await _context.Wards
                    .FirstOrDefaultAsync(x =>
                        x.WardId == dto.WardId);

            if (ward == null)
            {
                throw new Exception(
                    "Ward not found.");
            }

            var existingBoundary =
                await _context.WardBoundaries
                    .FirstOrDefaultAsync(x =>
                        x.WardId == dto.WardId);

            if (existingBoundary != null)
            {
                existingBoundary.GeoJson =
                    dto.GeoJson;

                existingBoundary.UpdatedAt =
                    DateTime.UtcNow;
            }
            else
            {
                await _context.WardBoundaries
                    .AddAsync(
                        new WardBoundary
                        {
                            WardId = dto.WardId,
                            GeoJson = dto.GeoJson
                        });
            }

            await _context.SaveChangesAsync();
        }
    }
}
