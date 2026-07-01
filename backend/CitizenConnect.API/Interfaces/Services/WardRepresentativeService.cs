using CitizenConnect.API.Domain.Entities;
using CitizenConnect.API.DTOs.WardRepresentatives;
using CitizenConnect.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CitizenConnect.API.Interfaces.Services
{
    public class WardRepresentativeService : IWardRepresentativeService
    {
        private readonly ApplicationDbContext _context;

        public WardRepresentativeService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<WardRepresentativeDto>> GetAllAsync()
        {
            return await _context.WardRepresentatives
                .Where(x => !x.IsDeleted)
                .Select(x => new WardRepresentativeDto
                {
                    Id = x.Id,
                    WardId = x.WardId,
                    RepresentativeName = x.RepresentativeName,
                    Designation = x.Designation,
                    MobileNumber = x.MobileNumber,
                    Email = x.Email,
                    Address = x.Address,
                    IsActive = x.IsActive,
                    CreatedAt = x.CreatedAt,
                    UpdatedAt = x.UpdatedAt
                })
                .ToListAsync();
        }

        public async Task<WardRepresentativeDto?> GetByIdAsync(int id)
        {
            return await _context.WardRepresentatives
                .Where(x => x.Id == id && !x.IsDeleted)
                .Select(x => new WardRepresentativeDto
                {
                    Id = x.Id,
                    WardId = x.WardId,
                    RepresentativeName = x.RepresentativeName,
                    Designation = x.Designation,
                    MobileNumber = x.MobileNumber,
                    Email = x.Email,
                    Address = x.Address,
                    IsActive = x.IsActive,
                    CreatedAt = x.CreatedAt,
                    UpdatedAt = x.UpdatedAt
                })
                .FirstOrDefaultAsync();
        }

        public async Task<List<WardRepresentativeDto>> GetByWardIdAsync(int wardId)
        {
            return await _context.WardRepresentatives
                .Where(x => x.WardId == wardId && !x.IsDeleted)
                .Select(x => new WardRepresentativeDto
                {
                    Id = x.Id,
                    WardId = x.WardId,
                    RepresentativeName = x.RepresentativeName,
                    Designation = x.Designation,
                    MobileNumber = x.MobileNumber,
                    Email = x.Email,
                    Address = x.Address,
                    IsActive = x.IsActive,
                    CreatedAt = x.CreatedAt,
                    UpdatedAt = x.UpdatedAt
                })
                .ToListAsync();
        }

        public async Task<bool> CreateAsync(CreateWardRepresentativesDto dto)
        {
            foreach (var item in dto.Representatives)
            {
                var entity = new WardRepresentative
                {
                    WardId = dto.WardId,
                    RepresentativeName = item.RepresentativeName,
                    Designation = item.Designation,
                    MobileNumber = item.MobileNumber,
                    Email = item.Email,
                    Address = item.Address
                };

                _context.WardRepresentatives.Add(entity);
            }

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UpdateAsync(UpdateWardRepresentativeDto dto)
        {
            var entity = await _context.WardRepresentatives
                .FirstOrDefaultAsync(x => x.Id == dto.Id);

            if (entity == null)
                return false;

            entity.RepresentativeName = dto.RepresentativeName;
            entity.Designation = dto.Designation;
            entity.MobileNumber = dto.MobileNumber;
            entity.Email = dto.Email;
            entity.Address = dto.Address;
            entity.IsActive = dto.IsActive;
            entity.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.WardRepresentatives
                .FirstOrDefaultAsync(x => x.Id == id);

            if (entity == null)
                return false;

            entity.IsDeleted = true;
            entity.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
