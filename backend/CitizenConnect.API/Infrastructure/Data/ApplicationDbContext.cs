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
            // POLITICIAN -> WARD
            // =====================================================

            modelBuilder.Entity<Politician>()
                .HasOne(x => x.Ward)
                .WithMany(x => x.Politicians)
                .HasForeignKey(x => x.WardId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // POLITICIAN -> JURISDICTION TYPE
            // =====================================================

            modelBuilder.Entity<Politician>()
                .HasOne(x => x.JurisdictionType)
                .WithMany()
                .HasForeignKey(x => x.JurisdictionTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // JURISDICTION -> JURISDICTION TYPE
            // =====================================================

            modelBuilder.Entity<Jurisdiction>()
                .HasOne(j => j.JurisdictionType)
                .WithMany(jt => jt.Jurisdictions)
                .HasForeignKey(j => j.JurisdictionTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // WARD -> JURISDICTION
            // =====================================================

            modelBuilder.Entity<Ward>()
                .HasOne(w => w.Jurisdiction)
                .WithMany(j => j.Wards)
                .HasForeignKey(w => w.JurisdictionId)
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
                .WithMany()
                .HasForeignKey(f => f.JurisdictionId)
                .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // FACILITY DATA -> WARD
            // =====================================================

            modelBuilder.Entity<FacilityData>()
                .HasOne(f => f.Ward)
                .WithMany()
                .HasForeignKey(f => f.WardId)
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
                .HasIndex(x => x.WardNumber)
                .IsUnique();

            modelBuilder.Entity<Complaint>()
                .HasIndex(x => x.ComplaintNumber)
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
        }
    }
}