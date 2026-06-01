using CitizenConnect.API.Domain.Entities;
using CitizenConnect.Application.DTOs.FacilityModuleDtos;
using CitizenConnect.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

public class FacilityModuleService
    : IFacilityModuleService
{
    private readonly ApplicationDbContext _context;

    public FacilityModuleService(
        ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<FacilityModuleResponseDto>
        CreateAsync(CreateFacilityModuleDto dto)
    {
        var module = new FacilityModule
        {
            ModuleName = dto.ModuleName,
            ModuleDescription = dto.ModuleDescription,
            IconName = dto.IconName,
            IsActive = true
        };

        await _context.FacilityModules.AddAsync(module);

        await _context.SaveChangesAsync();

        return new FacilityModuleResponseDto
        {
            FacilityModuleId =
                module.FacilityModuleId,

            ModuleName =
                module.ModuleName,

            ModuleDescription =
                module.ModuleDescription,

            IconName =
                module.IconName,

            IsActive =
                module.IsActive
        };
    }

    public async Task<IEnumerable<FacilityModuleResponseDto>>
        GetAllAsync()
    {
        return await _context.FacilityModules
            .Select(x => new FacilityModuleResponseDto
            {
                FacilityModuleId =
                    x.FacilityModuleId,

                ModuleName =
                    x.ModuleName,

                ModuleDescription =
                    x.ModuleDescription,

                IconName =
                    x.IconName,

                IsActive =
                    x.IsActive
            })
            .ToListAsync();
    }

    public async Task<FacilityModuleResponseDto?>
        GetByIdAsync(int id)
    {
        return await _context.FacilityModules
            .Where(x => x.FacilityModuleId == id)
            .Select(x => new FacilityModuleResponseDto
            {
                FacilityModuleId =
                    x.FacilityModuleId,

                ModuleName =
                    x.ModuleName,

                ModuleDescription =
                    x.ModuleDescription,

                IconName =
                    x.IconName,

                IsActive =
                    x.IsActive
            })
            .FirstOrDefaultAsync();
    }

    public async Task<bool>
        UpdateAsync(UpdateFacilityModuleDto dto)
    {
        var module =
            await _context.FacilityModules
                .FirstOrDefaultAsync(x =>
                    x.FacilityModuleId ==
                    dto.FacilityModuleId);

        if (module == null)
            return false;

        module.ModuleName =
            dto.ModuleName;

        module.ModuleDescription =
            dto.ModuleDescription;

        module.IconName =
            dto.IconName;

        module.IsActive =
            dto.IsActive;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool>
        DeleteAsync(int id)
    {
        var module =
            await _context.FacilityModules
                .FirstOrDefaultAsync(x =>
                    x.FacilityModuleId == id);

        if (module == null)
            return false;

        _context.FacilityModules.Remove(module);

        await _context.SaveChangesAsync();

        return true;
    }
}