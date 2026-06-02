using CitizenConnect.API.Domain.Entities;
using CitizenConnect.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CitizenConnect.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // =====================================================
        // DB SETS
        // =====================================================

        public DbSet<User> Users => Set<User>();

        public DbSet<Role> Roles => Set<Role>();

        public DbSet<Citizen> Citizens => Set<Citizen>();

        public DbSet<Politician> Politicians => Set<Politician>();

        public DbSet<Ward> Wards => Set<Ward>();

        public DbSet<Jurisdiction> Jurisdictions
            => Set<Jurisdiction>();

        public DbSet<JurisdictionType> JurisdictionTypes
            => Set<JurisdictionType>();

        public DbSet<ResidenceType> ResidenceTypes
            => Set<ResidenceType>();

        public DbSet<Complaint> Complaints
            => Set<Complaint>();

        public DbSet<ComplaintCategory> ComplaintCategories
            => Set<ComplaintCategory>();

        public DbSet<ComplaintImage> ComplaintImages
            => Set<ComplaintImage>();

        public DbSet<ComplaintStatusHistory>
            ComplaintStatusHistories
                => Set<ComplaintStatusHistory>();

        public DbSet<Suggestion> Suggestions
            => Set<Suggestion>();

        public DbSet<SuggestionCategory>
            SuggestionCategories
                => Set<SuggestionCategory>();

        public DbSet<SuggestionAttachment>
            SuggestionAttachments
                => Set<SuggestionAttachment>();

        public DbSet<SuggestionVote>
            SuggestionVotes
                => Set<SuggestionVote>();

        public DbSet<SuggestionStatusHistory>
            SuggestionStatusHistories
                => Set<SuggestionStatusHistory>();

        public DbSet<Locality> Localities
            => Set<Locality>();

        public DbSet<LocalityType> LocalityTypes
            => Set<LocalityType>();

        public DbSet<Department> Departments
            => Set<Department>();

        public DbSet<Officer> Officers
            => Set<Officer>();

        public DbSet<WardDepartment> WardDepartments
            => Set<WardDepartment>();

        public DbSet<SuggestionStatusMaster>
            SuggestionStatusMasters
                => Set<SuggestionStatusMaster>();

        public DbSet<ComplaintStatusMaster>
            ComplaintStatusMasters
                => Set<ComplaintStatusMaster>();

        // =====================================================
        // DYNAMIC FACILITY SYSTEM
        // =====================================================

        public DbSet<FacilityModule> FacilityModules
            => Set<FacilityModule>();

        public DbSet<FacilityField> FacilityFields
            => Set<FacilityField>();

        public DbSet<FacilityData> FacilityDatas
            => Set<FacilityData>();

        public DbSet<FacilityFieldOption> FacilityFieldOptions
    => Set<FacilityFieldOption>();

        public DbSet<Demographic> Demographics { get; set; }

        
        // =====================================================
        // MODEL CONFIGURATION
        // =====================================================

        protected override void OnModelCreating(
            ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // =====================================================
            // USER -> ROLE
            // =====================================================

            modelBuilder.Entity<User>()
                .HasOne(x => x.Role)
                .WithMany(x => x.Users)
                .HasForeignKey(x => x.RoleId)
                .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // CITIZEN -> USER
            // =====================================================

            modelBuilder.Entity<Citizen>()
                .HasOne(x => x.User)
                .WithOne(x => x.Citizen)
                .HasForeignKey<Citizen>(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // POLITICIAN -> USER
            // =====================================================

            modelBuilder.Entity<Politician>()
                .HasOne(x => x.User)
                .WithOne(x => x.Politician)
                .HasForeignKey<Politician>(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // POLITICIAN -> JURISDICTION
            // =====================================================

            modelBuilder.Entity<Politician>()
     .HasOne(x => x.JurisdictionType)
     .WithMany(x => x.Politicians)
     .HasForeignKey(x => x.JurisdictionTypeId)
     .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // POLITICIAN -> WARD
            // =====================================================

            modelBuilder.Entity<Politician>()
                .HasOne(x => x.Ward)
                .WithMany(x => x.Politicians)
                .HasForeignKey(x => x.WardId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // CITIZEN -> WARD
            // =====================================================

            modelBuilder.Entity<Citizen>()
                .HasOne(x => x.Ward)
                .WithMany(x => x.Citizens)
                .HasForeignKey(x => x.WardId)
                .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // CITIZEN -> RESIDENCE TYPE
            // =====================================================

            modelBuilder.Entity<Citizen>()
                .HasOne(x => x.ResidenceType)
                .WithMany(x => x.Citizens)
                .HasForeignKey(x => x.ResidenceTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // JURISDICTION -> JURISDICTION TYPE
            // =====================================================

            modelBuilder.Entity<Jurisdiction>()
    .HasOne(j => j.JurisdictionType)
    .WithMany()
    .HasForeignKey(j => j.JurisdictionTypeId)
    .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // WARD -> JURISDICTION
            // =====================================================

            modelBuilder.Entity<Ward>()
    .HasOne(w => w.JurisdictionType)
    .WithMany(jt => jt.Wards)
    .HasForeignKey(w => w.JurisdictionTypeId)
    .OnDelete(DeleteBehavior.Restrict);
            // =====================================================
            // COMPLAINT -> CITIZEN
            // =====================================================

            modelBuilder.Entity<Complaint>()
                .HasOne(x => x.Citizen)
                .WithMany(x => x.Complaints)
                .HasForeignKey(x => x.CitizenId)
                .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // COMPLAINT -> WARD
            // =====================================================

            modelBuilder.Entity<Complaint>()
                .HasOne(x => x.Ward)
                .WithMany(x => x.Complaints)
                .HasForeignKey(x => x.WardId)
                .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // COMPLAINT -> CATEGORY
            // =====================================================

            modelBuilder.Entity<Complaint>()
                .HasOne(x => x.ComplaintCategory)
                .WithMany(x => x.Complaints)
                .HasForeignKey(x => x.ComplaintCategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // COMPLAINT -> DEPARTMENT
            // =====================================================

            modelBuilder.Entity<Complaint>()
                .HasOne(x => x.Department)
                .WithMany(x => x.Complaints)
                .HasForeignKey(x => x.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // COMPLAINT -> ASSIGNED OFFICER
            // =====================================================

            modelBuilder.Entity<Complaint>()
                .HasOne(x => x.AssignedOfficer)
                .WithMany(x => x.Complaints)
                .HasForeignKey(x => x.AssignedOfficerId)
                .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // COMPLAINT IMAGE -> COMPLAINT
            // =====================================================

            modelBuilder.Entity<ComplaintImage>()
                .HasOne(x => x.Complaint)
                .WithMany(x => x.ComplaintImages)
                .HasForeignKey(x => x.ComplaintId)
                .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // COMPLAINT STATUS HISTORY
            // =====================================================

            modelBuilder.Entity<ComplaintStatusHistory>()
                .HasOne(x => x.Complaint)
                .WithMany(x => x.ComplaintStatusHistories)
                .HasForeignKey(x => x.ComplaintId)
                .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // LOCALITY -> WARD
            // =====================================================

            modelBuilder.Entity<Locality>()
                .HasOne(x => x.Ward)
                .WithMany(x => x.Localities)
                .HasForeignKey(x => x.WardId)
                .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // LOCALITY -> LOCALITY TYPE
            // =====================================================

            modelBuilder.Entity<Locality>()
                .HasOne(x => x.LocalityType)
                .WithMany(x => x.Localities)
                .HasForeignKey(x => x.LocalityTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // OFFICER -> DEPARTMENT
            // =====================================================

            modelBuilder.Entity<Officer>()
                .HasOne(x => x.Department)
                .WithMany(x => x.Officers)
                .HasForeignKey(x => x.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // COMPLAINT CATEGORY -> DEPARTMENT
            // =====================================================

            modelBuilder.Entity<ComplaintCategory>()
                .HasOne(x => x.Department)
                .WithMany(x => x.ComplaintCategories)
                .HasForeignKey(x => x.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // WARD DEPARTMENT
            // =====================================================

            modelBuilder.Entity<WardDepartment>()
                .HasOne(x => x.Ward)
                .WithMany(x => x.WardDepartments)
                .HasForeignKey(x => x.WardId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<WardDepartment>()
                .HasOne(x => x.Department)
                .WithMany(x => x.WardDepartments)
                .HasForeignKey(x => x.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // SUGGESTION STATUS MASTER
            // =====================================================

            modelBuilder.Entity<SuggestionStatusMaster>()
                .HasIndex(x => x.StatusName)
                .IsUnique();

            modelBuilder.Entity<Suggestion>()
                .HasOne(x => x.SuggestionStatusMaster)
                .WithMany(x => x.Suggestions)
                .HasForeignKey(x => x.SuggestionStatusMasterId)
                .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<Suggestion>()
    .HasOne(x => x.Citizen)
    .WithMany(x => x.Suggestions)
    .HasForeignKey(x => x.CitizenId)
    .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Demographic>()
    .HasOne(d => d.Jurisdiction)
    .WithMany(j => j.Demographics)
    .HasForeignKey(d => d.JurisdictionId)
    .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<SuggestionVote>()
    .HasOne(x => x.Citizen)
    .WithMany(x => x.SuggestionVotes)
    .HasForeignKey(x => x.CitizenId)
    .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SuggestionVote>()
    .HasOne(x => x.Suggestion)
    .WithMany(x => x.SuggestionVotes)
    .HasForeignKey(x => x.SuggestionId)
    .OnDelete(DeleteBehavior.Restrict);
            // =====================================================
            // COMPLAINT STATUS MASTER
            // =====================================================

            modelBuilder.Entity<ComplaintStatusMaster>()
                .HasIndex(x => x.StatusName)
                .IsUnique();

            modelBuilder.Entity<Complaint>()
                .HasOne(x => x.ComplaintStatusMaster)
                .WithMany(x => x.Complaints)
                .HasForeignKey(x => x.ComplaintStatusMasterId)
                .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // FACILITY MODULE -> FACILITY FIELD
            // =====================================================

            modelBuilder.Entity<FacilityField>()
                .HasOne(f => f.FacilityModule)
                .WithMany(m => m.FacilityFields)
                .HasForeignKey(f => f.FacilityModuleId)
                .OnDelete(DeleteBehavior.Cascade);
            // =====================================================
            // FACILITY DATA -> JURISDICTION
            // =====================================================

            modelBuilder.Entity<FacilityData>()
                .HasOne(f => f.Jurisdiction)
                .WithMany(j => j.FacilityDatas)
                .HasForeignKey(f => f.JurisdictionId)
                .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // FACILITY DATA -> WARD
            // =====================================================

            modelBuilder.Entity<FacilityData>()
                .HasOne(f => f.Ward)
                .WithMany(w => w.FacilityDatas)
                .HasForeignKey(f => f.WardId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // FACILITY DATA -> FACILITY FIELD
            // =====================================================

            modelBuilder.Entity<FacilityData>()
                .HasOne(f => f.FacilityField)
                .WithMany()
                .HasForeignKey(f => f.FacilityFieldId)
                .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // FACILITY DATA -> FACILITY MODULE
            // =====================================================

            modelBuilder.Entity<FacilityData>()
                .HasOne(f => f.FacilityModule)
                .WithMany()
                .HasForeignKey(f => f.FacilityModuleId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Demographic>()
    .HasOne(d => d.Ward)
    .WithMany(w => w.Demographics)
    .HasForeignKey(d => d.WardId)
    .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // UNIQUE CONSTRAINTS
            // =====================================================

            modelBuilder.Entity<User>()
                .HasIndex(x => x.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(x => x.MobileNo)
                .IsUnique();

            modelBuilder.Entity<Department>()
                .HasIndex(x => x.DepartmentName)
                .IsUnique();
            modelBuilder.Entity<Ward>()
                .HasIndex(x => new
                {
                    x.JurisdictionTypeId,
                    x.WardNumber
                })
                .IsUnique();


            modelBuilder.Entity<Complaint>()
                .Property(x => x.ComplaintNumber)
                .IsRequired()
                .HasMaxLength(50);

            modelBuilder.Entity<Complaint>()
                .HasIndex(x => x.ComplaintNumber)
                .IsUnique();

            modelBuilder.Entity<Jurisdiction>()
                .HasIndex(x => x.JurisdictionName)
                .IsUnique();

            modelBuilder.Entity<JurisdictionType>()
                .HasIndex(x => x.JurisdictionTypeName)
                .IsUnique();

            modelBuilder.Entity<Politician>()
                .HasIndex(x => x.GovernmentId)
                .IsUnique();

            modelBuilder.Entity<FacilityModule>()
                .HasIndex(x => x.ModuleName)
                .IsUnique();

            // =====================================================
            // USER CONFIGURATION
            // =====================================================

            modelBuilder.Entity<User>()
                .Property(x => x.FirstName)
                .HasMaxLength(100);

            modelBuilder.Entity<User>()
                .Property(x => x.LastName)
                .HasMaxLength(100);

            modelBuilder.Entity<User>()
                .Property(x => x.MobileNo)
                .HasMaxLength(15);

            modelBuilder.Entity<User>()
                .Property(x => x.Email)
                .HasMaxLength(150);

            // =====================================================
            // JURISDICTION TYPE CONFIGURATION
            // =====================================================

            modelBuilder.Entity<JurisdictionType>()
                .Property(x => x.JurisdictionTypeName)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<JurisdictionType>()
                .Property(x => x.JurisdictionDescription)
                .HasMaxLength(500);

            // =====================================================
            // JURISDICTION CONFIGURATION
            // =====================================================

            modelBuilder.Entity<Jurisdiction>()
                .Property(x => x.JurisdictionName)
                .IsRequired()
                .HasMaxLength(200);

            modelBuilder.Entity<Jurisdiction>()
                .Property(x => x.Address)
                .HasMaxLength(500);

            modelBuilder.Entity<Jurisdiction>()
                .Property(x => x.Pincode)
                .HasColumnType("char(6)");

            modelBuilder.Entity<Jurisdiction>()
                .Property(x => x.Latitude)
                .HasColumnType("decimal(9,6)");

            modelBuilder.Entity<Jurisdiction>()
                .Property(x => x.Longitude)
                .HasColumnType("decimal(9,6)");

            // =====================================================
            // WARD CONFIGURATION
            // =====================================================

            modelBuilder.Entity<Ward>()
                .Property(x => x.WardNumber)
                .IsRequired()
                .HasMaxLength(20);

            modelBuilder.Entity<Ward>()
                .Property(x => x.WardName)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<Ward>()
                .Property(x => x.AreaName)
                .IsRequired()
                .HasMaxLength(150);

            modelBuilder.Entity<Ward>()
                .Property(x => x.Pincode)
                .IsRequired()
                .HasColumnType("char(6)");

            modelBuilder.Entity<Ward>()
                .Property(x => x.WardDescription)
                .HasMaxLength(500);

            modelBuilder.Entity<Ward>()
                .Property(x => x.Latitude)
                .HasColumnType("decimal(9,6)");

            modelBuilder.Entity<Ward>()
                .Property(x => x.Longitude)
                .HasColumnType("decimal(9,6)");

            // =====================================================
            // POLITICIAN CONFIGURATION
            // =====================================================

            modelBuilder.Entity<Politician>()
                .Property(x => x.PartyName)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<Politician>()
                .Property(x => x.PoliticianRole)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<Politician>()
                .Property(x => x.Gender)
                .HasMaxLength(20);

            modelBuilder.Entity<Politician>()
                .Property(x => x.Address)
                .HasMaxLength(500);

            modelBuilder.Entity<Politician>()
    .Property(x => x.GovernmentId)
    .IsRequired()
    .HasMaxLength(100);

            // =====================================================
            // LOCALITY CONFIGURATION
            // =====================================================

            modelBuilder.Entity<Locality>()
                .Property(x => x.Latitude)
                .HasColumnType("decimal(9,6)");

            modelBuilder.Entity<Locality>()
                .Property(x => x.Longitude)
                .HasColumnType("decimal(9,6)");

            // =====================================================
            // COMPLAINT LOCATION CONFIGURATION
            // =====================================================

            modelBuilder.Entity<Complaint>()
                .Property(x => x.Latitude)
                .HasColumnType("decimal(9,6)");

            modelBuilder.Entity<Complaint>()
                .Property(x => x.Longitude)
                .HasColumnType("decimal(9,6)");

            // =====================================================
            // DEPARTMENT CONFIGURATION
            // =====================================================

            modelBuilder.Entity<Department>()
                .Property(x => x.DepartmentName)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<Department>()
                .Property(x => x.Description)
                .HasMaxLength(500);

            // =====================================================
            // OFFICER CONFIGURATION
            // =====================================================

            modelBuilder.Entity<Officer>()
                .Property(x => x.FirstName)
                .IsRequired()
                .HasMaxLength(50);

            modelBuilder.Entity<Officer>()
                .Property(x => x.LastName)
                .IsRequired()
                .HasMaxLength(50);

            modelBuilder.Entity<Officer>()
                .Property(x => x.Email)
                .IsRequired()
                .HasMaxLength(150);

            modelBuilder.Entity<Officer>()
                .Property(x => x.MobileNumber)
                .IsRequired()
                .HasMaxLength(15);

            // =====================================================
            // FACILITY MODULE CONFIGURATION
            // =====================================================

            modelBuilder.Entity<FacilityModule>()
                .Property(x => x.ModuleName)
                .IsRequired()
                .HasMaxLength(150);

            modelBuilder.Entity<FacilityModule>()
    .Property(x => x.ModuleDescription)
    .HasMaxLength(500);

            // =====================================================
            // FACILITY FIELD CONFIGURATION
            // =====================================================

            modelBuilder.Entity<FacilityField>()
                .Property(x => x.FieldName)
                .IsRequired()
                .HasMaxLength(150);

            modelBuilder.Entity<FacilityField>()
                .Property(x => x.FieldType)
                .IsRequired()
                .HasMaxLength(50);

            modelBuilder.Entity<FacilityField>()
    .Property(x => x.Placeholder)
    .HasMaxLength(200);

            // =====================================================
            // FACILITY DATA CONFIGURATION
            // =====================================================

            modelBuilder.Entity<FacilityData>()
                .Property(x => x.FieldValue)
                .HasMaxLength(2000);

            modelBuilder.Entity<FacilityData>()
    .HasOne(x => x.FacilityField)
    .WithMany(x => x.FacilityDatas)
    .HasForeignKey(x => x.FacilityFieldId);


            modelBuilder.Entity<FacilityData>()
    .HasOne(x => x.FacilityModule)
    .WithMany(x => x.FacilityDatas)
    .HasForeignKey(x => x.FacilityModuleId);

            // =====================================================
            // FACILITY DATA INDEXES
            // =====================================================

            modelBuilder.Entity<FacilityData>()
                .HasIndex(x => x.JurisdictionId);

            modelBuilder.Entity<FacilityData>()
                .HasIndex(x => x.WardId);

            modelBuilder.Entity<FacilityData>()
                .HasIndex(x => x.FacilityModuleId);

            modelBuilder.Entity<FacilityData>()
                .HasIndex(x => x.FacilityFieldId);


            modelBuilder.Entity<FacilityFieldOption>()
    .HasOne(x => x.FacilityField)
    .WithMany(x => x.FacilityFieldOptions)
    .HasForeignKey(x => x.FacilityFieldId)
    .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<FacilityFieldOption>()
    .Property(x => x.OptionText)
    .IsRequired()
    .HasMaxLength(200);

            modelBuilder.Entity<FacilityData>()
    .HasIndex(x => new
    {
        x.JurisdictionId,
        x.WardId,
        x.FacilityModuleId,
        x.FacilityFieldId
    })
    .IsUnique();

            modelBuilder.Entity<FacilityField>()
    .HasIndex(x => new
    {
        x.FacilityModuleId,
        x.FieldName
    })
    .IsUnique();


            modelBuilder.Entity<Officer>()
    .HasIndex(x => x.Email)
    .IsUnique();
            modelBuilder.Entity<Officer>()
    .HasIndex(x => x.MobileNumber)
    .IsUnique();

            modelBuilder.Entity<Role>()
    .HasIndex(x => x.RoleName)
    .IsUnique();


            modelBuilder.Entity<WardDepartment>()
    .HasIndex(x => new
    {
        x.WardId,
        x.DepartmentId
    })
    .IsUnique();


            modelBuilder.Entity<Complaint>()
    .HasIndex(x => x.CreatedAt);

            modelBuilder.Entity<FacilityData>()
    .HasIndex(x => x.CreatedAt);

            modelBuilder.Entity<Suggestion>()
    .HasIndex(x => x.CreatedAt);


            modelBuilder.Entity<FacilityData>()
    .HasIndex(x => new
    {
        x.JurisdictionId,
        x.WardId,
        x.FacilityModuleId
    });


            modelBuilder.Entity<FacilityFieldOption>()
    .HasIndex(x => new
    {
        x.FacilityFieldId,
        x.OptionText
    })
    .IsUnique();


            modelBuilder.Entity<Demographic>(entity =>
            {
                entity.HasKey(d => d.DemographicId);

                entity.Property(d => d.MaleLiteracyRate)
                    .HasColumnType("decimal(5,2)");

                entity.Property(d => d.FemaleLiteracyRate)
                    .HasColumnType("decimal(5,2)");

                entity.Property(d => d.TotalLiteracyRate)
                    .HasColumnType("decimal(5,2)");

                entity.HasOne(d => d.Jurisdiction)
                    .WithMany(j => j.Demographics)
                    .HasForeignKey(d => d.JurisdictionId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.Ward)
                    .WithMany(w => w.Demographics)
                    .HasForeignKey(d => d.WardId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}