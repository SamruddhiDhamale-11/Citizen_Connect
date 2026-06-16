
using CitizenConnect.API.Domain.Entities;
using CitizenConnect.API.DTOs.Ward;
using CitizenConnect.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CitizenConnect.API.Interfaces.Services
{
    public class WardService : IWardService
    {
        private readonly ApplicationDbContext _context;

        public WardService(
            ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<WardResponseDto>>
GetAllAsync()
        {
            return await _context.Wards
                .Include(x => x.Jurisdiction)
                .Include(x => x.Localities)
                .Include(x => x.Citizens)
                .Include(x => x.Complaints)
                .Select(x => new WardResponseDto
                {
                    WardId = x.WardId,
                    WardNumber = x.WardNumber,
                    WardName = x.WardName,
                    AreaName = x.AreaName,
                    Pincode = x.Pincode,
                    WardDescription = x.WardDescription,
                    Latitude = x.Latitude,
                    Longitude = x.Longitude,

                    JurisdictionId =
                        x.JurisdictionId,

                    JurisdictionName =
                        x.Jurisdiction.JurisdictionName,

                    LocalityCount =
                        x.Localities.Count(),

                    CitizenCount =
                        x.Citizens.Count(),

                    ComplaintCount =
                        x.Complaints.Count()
                })
                .ToListAsync();
        }

        public async Task<WardResponseDto?>
            GetByIdAsync(int wardId)
        {
            return await _context.Wards
                .Include(x => x.Jurisdiction)
                .Where(x => x.WardId == wardId)
                .Select(x => new WardResponseDto
                {
                    WardId = x.WardId,
                    WardNumber = x.WardNumber,
                    WardName = x.WardName,
                    AreaName = x.AreaName,
                    Pincode = x.Pincode,
                    WardDescription =
                        x.WardDescription,
                    Latitude = x.Latitude,
                    Longitude = x.Longitude,
                    JurisdictionId =
                        x.JurisdictionId,
                    JurisdictionName =
                        x.Jurisdiction.JurisdictionName
                })
                .FirstOrDefaultAsync();
        }

        public async Task<WardResponseDto>
    CreateAsync(CreateWardDto dto)
        {
            var jurisdictionExists =
                await _context.Jurisdictions
                    .AnyAsync(x =>
                        x.JurisdictionId ==
                        dto.JurisdictionId);

            if (!jurisdictionExists)
            {
                throw new Exception(
                    "Invalid Jurisdiction.");
            }

            var wardNumber =
                dto.WardNumber.Trim();

            var exists =
                await _context.Wards.AnyAsync(x =>
                    x.JurisdictionId ==
                    dto.JurisdictionId &&
                    x.WardNumber.ToLower() ==
                    wardNumber.ToLower());

            if (exists)
            {
                throw new Exception(
                    "Ward number already exists.");
            }

            var ward = new Ward
            {
                WardNumber = wardNumber,
                WardName = dto.WardName.Trim(),
                AreaName = dto.AreaName.Trim(),
                Pincode = dto.Pincode.Trim(),
                WardDescription =
                    dto.WardDescription,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                JurisdictionId =
                    dto.JurisdictionId
            };

            _context.Wards.Add(ward);

            await _context.SaveChangesAsync();

            return await GetByIdAsync(ward.WardId)
                ?? throw new Exception(
                    "Ward not found.");
        }
        

        public async Task<bool>
            UpdateAsync(
                int wardId,
                UpdateWardDto dto)
        {
            var ward =
                await _context.Wards
                .FindAsync(wardId);

            if (ward == null)
                return false;

            ward.WardNumber =
                dto.WardNumber;

            ward.WardName =
                dto.WardName;

            ward.AreaName =
                dto.AreaName;

            ward.Pincode =
                dto.Pincode;

            ward.WardDescription =
                dto.WardDescription;

            ward.Latitude =
                dto.Latitude;

            ward.Longitude =
                dto.Longitude;

            ward.JurisdictionId =
                dto.JurisdictionId;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool>
DeleteAsync(int wardId)
        {
            var ward =
                await _context.Wards
                .Include(x => x.Localities)
                .Include(x => x.Citizens)
                .FirstOrDefaultAsync(
                    x => x.WardId == wardId);

            if (ward == null)
                return false;

            if (ward.Citizens.Any())
                throw new Exception(
                    "Cannot delete ward with citizens.");

            if (ward.Localities.Any())
                throw new Exception(
                    "Cannot delete ward with localities.");

            _context.Wards.Remove(ward);

            await _context.SaveChangesAsync();

            return true;
        }


        public async Task<List<WardDropdownDto>>
    GetDropdownAsync()
        {
            return await _context.Wards
                .OrderBy(x => x.WardName)
                .Select(x => new WardDropdownDto
                {
                    WardId = x.WardId,
                    WardName = x.WardName,
                    WardNumber = x.WardNumber
                })
                .ToListAsync();
        }
    }
}
