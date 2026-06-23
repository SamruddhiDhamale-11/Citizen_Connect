using CitizenConnect.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO;

namespace CitizenConnect.API.Interfaces.Services
{
    public class WardValidationService
        : IWardValidationService
    {
        private readonly ApplicationDbContext _context;

        public WardValidationService(
            ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> IsLocationInsideWardAsync(
     int wardId,
     decimal latitude,
     decimal longitude)
        {
            var boundary =
                await _context.WardBoundaries
                    .FirstOrDefaultAsync(x =>
                        x.WardId == wardId);

            if (boundary == null)
            {
                throw new Exception(
                    "Ward boundary not configured.");
            }

            var reader = new GeoJsonReader();

            var polygon =
                reader.Read<Geometry>(
                    boundary.GeoJson);

            var point = new Point(
                (double)longitude,
                (double)latitude);

            return polygon.Contains(point);
        }



    }
}
