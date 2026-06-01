
using CitizenConnect.API.Domain.Entities;
using CitizenConnect.API.Domain.Enums;
using CitizenConnect.Domain.Entities;
using CitizenConnect.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CitizenConnect.Infrastructure.Seed
{
    public static class DbInitializer
    {
        public static async Task SeedAsync(
            ApplicationDbContext context)
        {
            // =====================================================
            // APPLY PENDING MIGRATIONS
            // =====================================================

            if (context.Database.GetPendingMigrations().Any())
            {
                await context.Database.MigrateAsync();
            }

            // =====================================================
            // JURISDICTION TYPES
            // =====================================================

            if (!context.JurisdictionTypes.Any())
            {
                var jurisdictionTypes = new List<JurisdictionType>
                {
                    new JurisdictionType
                    {
                        JurisdictionTypeName = "GramPanchayat",
                        JurisdictionDescription =
                            "Village level local government"
                    },

                    new JurisdictionType
                    {
                        JurisdictionTypeName =
                            "Municipal Corporation",

                        JurisdictionDescription =
                            "Urban local governing body"
                    },

                    new JurisdictionType
                    {
                        JurisdictionTypeName =
                            "Nagar Parishad",

                        JurisdictionDescription =
                            "Small city local body"
                    }
                };

                await context.JurisdictionTypes
                    .AddRangeAsync(jurisdictionTypes);

                await context.SaveChangesAsync();
            }

            // =====================================================
            // JURISDICTIONS
            // =====================================================

            if (!context.Jurisdictions.Any())
            {
                var gramPanchayatType =
                    await context.JurisdictionTypes
                    .FirstAsync(x =>
                        x.JurisdictionTypeName ==
                        "GramPanchayat");

                var jurisdiction = new Jurisdiction
                {
                    JurisdictionName =
                        "Ambale GramPanchayat",

                    JurisdictionTypeId =
                        gramPanchayatType
                        .JurisdictionTypeId,

                    Address = "Ambale Village",

                    Pincode = "412206",

                    Latitude = 18.520430m,

                    Longitude = 73.856743m
                };

                await context.Jurisdictions
                    .AddAsync(jurisdiction);

                await context.SaveChangesAsync();
            }

            // =====================================================
            // WARDS
            // =====================================================

            if (!context.Wards.Any())
            {
                var jurisdiction =
                    await context.Jurisdictions
                    .FirstAsync();

                var wards = new List<Ward>
                {
                    new Ward
                    {
                        WardNumber = "1",
                        WardName = "Ward 1",
                        AreaName = "Ambale East",
                        Pincode = "412206",
                        JurisdictionTypeId =
    jurisdiction.JurisdictionTypeId,

                        Latitude = 18.520430m,
                        Longitude = 73.856743m
                    },

                    new Ward
                    {
                        WardNumber = "2",
                        WardName = "Ward 2",
                        AreaName = "Ambale West",
                        Pincode = "412206",
                        JurisdictionTypeId =
    jurisdiction.JurisdictionTypeId,

                        Latitude = 18.520430m,
                        Longitude = 73.856743m
                    },

                    new Ward
                    {
                        WardNumber = "3",
                        WardName = "Ward 3",
                        AreaName = "Ambale Center",
                        Pincode = "412206",
                        JurisdictionTypeId =
    jurisdiction.JurisdictionTypeId,

                        Latitude = 18.520430m,
                        Longitude = 73.856743m
                    }
                };

                await context.Wards.AddRangeAsync(wards);

                await context.SaveChangesAsync();
            }

            // =====================================================
            // FACILITY MODULES
            // =====================================================

            if (!context.FacilityModules.Any())
            {
                var modules = new List<FacilityModule>
                {
                    new FacilityModule
                    {
                        ModuleName = "Water Supply",
                        ModuleDescription =
                            "Village water resources"
                    },

                    new FacilityModule
                    {
                        ModuleName =
                            "Health Facilities",

                        ModuleDescription =
                            "Health infrastructure"
                    },

                    new FacilityModule
                    {
                        ModuleName = "Education",

                        ModuleDescription =
                            "Education facilities"
                    },

                    new FacilityModule
                    {
                        ModuleName = "Roads",

                        ModuleDescription =
                            "Road infrastructure"
                    },

                    new FacilityModule
                    {
                        ModuleName = "Electricity",

                        ModuleDescription =
                            "Electricity infrastructure"
                    }
                };

                await context.FacilityModules
                    .AddRangeAsync(modules);

                await context.SaveChangesAsync();
            }

            // =====================================================
            // FACILITY FIELDS
            // =====================================================

            if (!context.FacilityFields.Any())
            {
                var waterSupply =
                    await context.FacilityModules
                    .FirstAsync(x =>
                        x.ModuleName ==
                        "Water Supply");

                var health =
                    await context.FacilityModules
                    .FirstAsync(x =>
                        x.ModuleName ==
                        "Health Facilities");

                var education =
                    await context.FacilityModules
                    .FirstAsync(x =>
                        x.ModuleName ==
                        "Education");

                var fields = new List<FacilityField>
                {
                    // WATER SUPPLY

                    new FacilityField
                    {
                        FacilityModuleId =
                            waterSupply.FacilityModuleId,

                        FieldName = "Borewells",

                        FieldType = FacilityFieldType.Number,

                        IsRequired = true,

                        DisplayOrder = 1,

                        Placeholder =
                            "Enter number of borewells"
                    },

                    new FacilityField
                    {
                        FacilityModuleId =
                            waterSupply.FacilityModuleId,

                        FieldName = "Water Tanks",

                        FieldType = FacilityFieldType.Number,

                        IsRequired = true,

                        DisplayOrder = 2,

                        Placeholder =
                            "Enter number of tanks"
                    },

                    // HEALTH

                    new FacilityField
                    {
                        FacilityModuleId =
                            health.FacilityModuleId,

                        FieldName = "Hospitals",

                        FieldType = FacilityFieldType.Number,

                        IsRequired = true,

                        DisplayOrder = 1,

                        Placeholder =
                            "Enter number of hospitals"
                    },

                    // EDUCATION

                    new FacilityField
                    {
                        FacilityModuleId =
                            education.FacilityModuleId,

                        FieldName = "Schools",

                        FieldType = FacilityFieldType.Number,

                        IsRequired = true,

                        DisplayOrder = 1,

                        Placeholder =
                            "Enter number of schools"
                    }
                };

                await context.FacilityFields
                    .AddRangeAsync(fields);

                await context.SaveChangesAsync();
            }
        }
    }
}