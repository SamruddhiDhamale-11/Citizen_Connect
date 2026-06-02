using CitizenConnect.API.Domain.Entities;
using CitizenConnect.API.DTOs.DemographicDto;
using CitizenConnect.API.Interfaces.Services;
using CitizenConnect.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CitizenConnect.API.Services
{
    public class DemographicService : IDemographicService
    {
        private readonly ApplicationDbContext _context;

        public DemographicService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ResponseDemographicDto>
            CreateAsync(CreateDemographicDto dto)
        {
            var demographic = new Demographic
            {
                JurisdictionId = dto.JurisdictionId,
                WardId = dto.WardId,
                TotalPopulation = dto.TotalPopulation,
                MalePopulation = dto.MalePopulation,
                FemalePopulation = dto.FemalePopulation,
                ChildPopulation = dto.ChildPopulation,
                SeniorCitizenPopulation = dto.SeniorCitizenPopulation,
                TotalHouseholds = dto.TotalHouseholds,
                MaleLiteracyRate = dto.MaleLiteracyRate,
                FemaleLiteracyRate = dto.FemaleLiteracyRate,
                TotalLiteracyRate = dto.TotalLiteracyRate,
                TotalVoters = dto.TotalVoters,
                SurveyYear = dto.SurveyYear,
                IsActive = dto.IsActive
            };

            _context.Demographics.Add(demographic);

            await _context.SaveChangesAsync();

            return await GetByIdAsync(demographic.DemographicId)
                ?? throw new Exception("Failed to create demographic.");
        }

        public async Task<IEnumerable<ResponseDemographicDto>>
            GetAllAsync()
        {
            return await _context.Demographics
                .Select(x => new ResponseDemographicDto
                {
                    DemographicId = x.DemographicId,

                    JurisdictionId = x.JurisdictionId,
                    JurisdictionName = x.Jurisdiction.JurisdictionName,

                    WardId = x.WardId,
                    WardName = x.Ward != null
                        ? x.Ward.WardName
                        : null,

                    TotalPopulation = x.TotalPopulation,
                    MalePopulation = x.MalePopulation,
                    FemalePopulation = x.FemalePopulation,
                    ChildPopulation = x.ChildPopulation,
                    SeniorCitizenPopulation = x.SeniorCitizenPopulation,
                    TotalHouseholds = x.TotalHouseholds,
                    MaleLiteracyRate = x.MaleLiteracyRate,
                    FemaleLiteracyRate = x.FemaleLiteracyRate,
                    TotalLiteracyRate = x.TotalLiteracyRate,
                    TotalVoters = x.TotalVoters,
                    SurveyYear = x.SurveyYear,
                    IsActive = x.IsActive
                })
                .ToListAsync();
        }

        public async Task<ResponseDemographicDto?>
            GetByIdAsync(int demographicId)
        {
            return await _context.Demographics
                .Where(x => x.DemographicId == demographicId)
                .Select(x => new ResponseDemographicDto
                {
                    DemographicId = x.DemographicId,

                    JurisdictionId = x.JurisdictionId,
                    JurisdictionName = x.Jurisdiction.JurisdictionName,

                    WardId = x.WardId,
                    WardName = x.Ward != null
                        ? x.Ward.WardName
                        : null,

                    TotalPopulation = x.TotalPopulation,
                    MalePopulation = x.MalePopulation,
                    FemalePopulation = x.FemalePopulation,
                    ChildPopulation = x.ChildPopulation,
                    SeniorCitizenPopulation = x.SeniorCitizenPopulation,
                    TotalHouseholds = x.TotalHouseholds,
                    MaleLiteracyRate = x.MaleLiteracyRate,
                    FemaleLiteracyRate = x.FemaleLiteracyRate,
                    TotalLiteracyRate = x.TotalLiteracyRate,
                    TotalVoters = x.TotalVoters,
                    SurveyYear = x.SurveyYear,
                    IsActive = x.IsActive
                })
                .FirstOrDefaultAsync();
        }

        public async Task<bool>
            UpdateAsync(
                int demographicId,
                UpdateDemographicDto dto)
        {
            var demographic = await _context.Demographics
                .FirstOrDefaultAsync(x =>
                    x.DemographicId == demographicId);

            if (demographic == null)
            {
                return false;
            }

            demographic.JurisdictionId = dto.JurisdictionId;
            demographic.WardId = dto.WardId;
            demographic.TotalPopulation = dto.TotalPopulation;
            demographic.MalePopulation = dto.MalePopulation;
            demographic.FemalePopulation = dto.FemalePopulation;
            demographic.ChildPopulation = dto.ChildPopulation;
            demographic.SeniorCitizenPopulation = dto.SeniorCitizenPopulation;
            demographic.TotalHouseholds = dto.TotalHouseholds;
            demographic.MaleLiteracyRate = dto.MaleLiteracyRate;
            demographic.FemaleLiteracyRate = dto.FemaleLiteracyRate;
            demographic.TotalLiteracyRate = dto.TotalLiteracyRate;
            demographic.TotalVoters = dto.TotalVoters;
            demographic.SurveyYear = dto.SurveyYear;
            demographic.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool>
            DeleteAsync(int demographicId)
        {
            var demographic = await _context.Demographics
                .FirstOrDefaultAsync(x =>
                    x.DemographicId == demographicId);

            if (demographic == null)
            {
                return false;
            }

            _context.Demographics.Remove(demographic);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<ResponseDemographicDto>>
    GetByJurisdictionAsync(int jurisdictionId)
        {
            return await _context.Demographics
                .Where(x => x.JurisdictionId == jurisdictionId)
                .Select(x => new ResponseDemographicDto
                {
                    DemographicId = x.DemographicId,
                    JurisdictionId = x.JurisdictionId,
                    JurisdictionName = x.Jurisdiction.JurisdictionName,
                    WardId = x.WardId,
                    WardName = x.Ward != null
                        ? x.Ward.WardName
                        : null,
                    TotalPopulation = x.TotalPopulation,
                    MalePopulation = x.MalePopulation,
                    FemalePopulation = x.FemalePopulation,
                    ChildPopulation = x.ChildPopulation,
                    SeniorCitizenPopulation = x.SeniorCitizenPopulation,
                    TotalHouseholds = x.TotalHouseholds,
                    MaleLiteracyRate = x.MaleLiteracyRate,
                    FemaleLiteracyRate = x.FemaleLiteracyRate,
                    TotalLiteracyRate = x.TotalLiteracyRate,
                    TotalVoters = x.TotalVoters,
                    SurveyYear = x.SurveyYear,
                    IsActive = x.IsActive
                })
                .ToListAsync();
        }


        public async Task<IEnumerable<ResponseDemographicDto>>
    GetByWardAsync(int wardId)
        {
            return await _context.Demographics
                .Where(x => x.WardId == wardId)
                .Select(x => new ResponseDemographicDto
                {
                    DemographicId = x.DemographicId,
                    JurisdictionId = x.JurisdictionId,
                    JurisdictionName = x.Jurisdiction.JurisdictionName,
                    WardId = x.WardId,
                    WardName = x.Ward != null
                        ? x.Ward.WardName
                        : null,
                    TotalPopulation = x.TotalPopulation,
                    MalePopulation = x.MalePopulation,
                    FemalePopulation = x.FemalePopulation,
                    ChildPopulation = x.ChildPopulation,
                    SeniorCitizenPopulation = x.SeniorCitizenPopulation,
                    TotalHouseholds = x.TotalHouseholds,
                    MaleLiteracyRate = x.MaleLiteracyRate,
                    FemaleLiteracyRate = x.FemaleLiteracyRate,
                    TotalLiteracyRate = x.TotalLiteracyRate,
                    TotalVoters = x.TotalVoters,
                    SurveyYear = x.SurveyYear,
                    IsActive = x.IsActive
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<ResponseDemographicDto>>
    GetBySurveyYearAsync(int surveyYear)
        {
            return await _context.Demographics
                .Where(x => x.SurveyYear == surveyYear)
                .Select(x => new ResponseDemographicDto
                {
                    DemographicId = x.DemographicId,
                    JurisdictionId = x.JurisdictionId,
                    JurisdictionName = x.Jurisdiction.JurisdictionName,
                    WardId = x.WardId,
                    WardName = x.Ward != null
                        ? x.Ward.WardName
                        : null,
                    TotalPopulation = x.TotalPopulation,
                    MalePopulation = x.MalePopulation,
                    FemalePopulation = x.FemalePopulation,
                    ChildPopulation = x.ChildPopulation,
                    SeniorCitizenPopulation = x.SeniorCitizenPopulation,
                    TotalHouseholds = x.TotalHouseholds,
                    MaleLiteracyRate = x.MaleLiteracyRate,
                    FemaleLiteracyRate = x.FemaleLiteracyRate,
                    TotalLiteracyRate = x.TotalLiteracyRate,
                    TotalVoters = x.TotalVoters,
                    SurveyYear = x.SurveyYear,
                    IsActive = x.IsActive
                })
                .ToListAsync();
        }
    }
}