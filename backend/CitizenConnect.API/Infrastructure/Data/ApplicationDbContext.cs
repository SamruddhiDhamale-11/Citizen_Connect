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

        // =========================================
        // DB SETS
        // =========================================

        public DbSet<User> Users => Set<User>();

        public DbSet<Role> Roles => Set<Role>();

        public DbSet<Citizen> Citizens => Set<Citizen>();

        public DbSet<Politician> Politicians => Set<Politician>();

        public DbSet<Ward> Wards => Set<Ward>();

        public DbSet<ResidenceType> ResidenceTypes
            => Set<ResidenceType>();

        public DbSet<JurisdictionType> JurisdictionTypes
            => Set<JurisdictionType>();

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

        // =========================================
        // NEW MODULES
        // =========================================

        public DbSet<Department> Departments
            => Set<Department>();

        public DbSet<Officer> Officers
            => Set<Officer>();

        // =========================================
        // MODEL CONFIGURATION
        // =========================================

        protected override void OnModelCreating(
            ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // =========================================
            // USER -> ROLE
            // =========================================

            modelBuilder.Entity<User>()
                .HasOne(x => x.Role)
                .WithMany(x => x.Users)
                .HasForeignKey(x => x.RoleId)
                .OnDelete(DeleteBehavior.Restrict);

            // =========================================
            // CITIZEN -> USER
            // =========================================

            modelBuilder.Entity<Citizen>()
                .HasOne(x => x.User)
                .WithOne(x => x.Citizen)
                .HasForeignKey<Citizen>(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // =========================================
            // POLITICIAN -> USER
            // =========================================

            modelBuilder.Entity<Politician>()
                .HasOne(x => x.User)
                .WithOne(x => x.Politician)
                .HasForeignKey<Politician>(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // =========================================
            // CITIZEN -> WARD
            // =========================================

            modelBuilder.Entity<Citizen>()
                .HasOne(x => x.Ward)
                .WithMany(x => x.Citizens)
                .HasForeignKey(x => x.WardId)
                .OnDelete(DeleteBehavior.Restrict);

            // =========================================
            // CITIZEN -> RESIDENCE TYPE
            // =========================================

            modelBuilder.Entity<Citizen>()
                .HasOne(x => x.ResidenceType)
                .WithMany(x => x.Citizens)
                .HasForeignKey(x => x.ResidenceTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            // =========================================
            // POLITICIAN -> WARD
            // =========================================

            modelBuilder.Entity<Politician>()
                .HasOne(x => x.Ward)
                .WithMany(x => x.Politicians)
                .HasForeignKey(x => x.WardId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            // =========================================
            // POLITICIAN -> JURISDICTION TYPE
            // =========================================

            modelBuilder.Entity<Politician>()
                .HasOne(x => x.JurisdictionType)
                .WithMany(x => x.Politicians)
                .HasForeignKey(x => x.JurisdictionTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            // =========================================
            // WARD -> JURISDICTION TYPE
            // =========================================

            modelBuilder.Entity<Ward>()
                .HasOne(x => x.JurisdictionType)
                .WithMany(x => x.Wards)
                .HasForeignKey(x => x.JurisdictionTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            // =========================================
            // COMPLAINT -> CITIZEN
            // =========================================

            modelBuilder.Entity<Complaint>()
                .HasOne(x => x.Citizen)
                .WithMany(x => x.Complaints)
                .HasForeignKey(x => x.CitizenId)
                .OnDelete(DeleteBehavior.Restrict);

            // =========================================
            // COMPLAINT -> WARD
            // =========================================

            modelBuilder.Entity<Complaint>()
                .HasOne(x => x.Ward)
                .WithMany(x => x.Complaints)
                .HasForeignKey(x => x.WardId)
                .OnDelete(DeleteBehavior.Restrict);

            // =========================================
            // COMPLAINT -> CATEGORY
            // =========================================

            modelBuilder.Entity<Complaint>()
                .HasOne(x => x.ComplaintCategory)
                .WithMany(x => x.Complaints)
                .HasForeignKey(x => x.ComplaintCategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // =========================================
            // COMPLAINT IMAGE -> COMPLAINT
            // =========================================

            modelBuilder.Entity<ComplaintImage>()
                .HasOne(x => x.Complaint)
                .WithMany(x => x.ComplaintImages)
                .HasForeignKey(x => x.ComplaintId)
                .OnDelete(DeleteBehavior.Restrict);

            // =========================================
            // COMPLAINT STATUS HISTORY
            // =========================================

            modelBuilder.Entity<ComplaintStatusHistory>()
                .HasOne(x => x.Complaint)
                .WithMany(x => x.ComplaintStatusHistories)
                .HasForeignKey(x => x.ComplaintId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ComplaintStatusHistory>()
                .HasOne(x => x.ChangedByUser)
                .WithMany(x => x.ComplaintStatusHistories)
                .HasForeignKey(x => x.ChangedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // =========================================
            // SUGGESTION VOTE
            // =========================================

            modelBuilder.Entity<SuggestionVote>()
                .HasOne(x => x.Citizen)
                .WithMany()
                .HasForeignKey(x => x.CitizenId)
                .OnDelete(DeleteBehavior.Restrict);

            // =========================================
            // SUGGESTION STATUS HISTORY
            // =========================================

            modelBuilder.Entity<SuggestionStatusHistory>()
                .HasOne(x => x.ChangedByUser)
                .WithMany()
                .HasForeignKey(x => x.ChangedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // =========================================
            // UNIQUE CONSTRAINTS
            // =========================================

            modelBuilder.Entity<User>()
                .HasIndex(x => x.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(x => x.MobileNo)
                .IsUnique();

            modelBuilder.Entity<Department>()
                .HasIndex(x => x.DepartmentName)
                .IsUnique();

            // =========================================
            // COLUMN CONFIGURATIONS
            // =========================================

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

            modelBuilder.Entity<Ward>()
                .Property(x => x.Latitude)
                .HasColumnType("decimal(18,6)");

            modelBuilder.Entity<Ward>()
                .Property(x => x.Longitude)
                .HasColumnType("decimal(18,6)");

            modelBuilder.Entity<Complaint>()
                .Property(x => x.Latitude)
                .HasColumnType("decimal(18,6)");

            modelBuilder.Entity<Complaint>()
                .Property(x => x.Longitude)
                .HasColumnType("decimal(18,6)");

            modelBuilder.Entity<Complaint>()
                .HasIndex(x => x.ComplaintNumber)
                .IsUnique();

            // =========================================
            // DEPARTMENT CONFIGURATION
            // =========================================

            modelBuilder.Entity<Department>()
                .Property(x => x.DepartmentName)
                .IsRequired()
                .HasMaxLength(100);

            // =========================================
            // COMPLAINT CATEGORY -> DEPARTMENT
            // =========================================

            modelBuilder.Entity<ComplaintCategory>()
                .HasOne(x => x.Department)
                .WithMany(x => x.ComplaintCategories)
                .HasForeignKey(x => x.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            // =========================================
            // OFFICER CONFIGURATION
            // =========================================

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

            // =========================================
            // OFFICER -> DEPARTMENT
            // =========================================

            modelBuilder.Entity<Officer>()
                .HasOne(x => x.Department)
                .WithMany(x => x.Officers)
                .HasForeignKey(x => x.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            // =========================================
            // COMPLAINT -> DEPARTMENT
            // =========================================

            modelBuilder.Entity<Complaint>()
                .HasOne(x => x.Department)
                .WithMany(x => x.Complaints)
                .HasForeignKey(x => x.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            // =========================================
            // COMPLAINT -> ASSIGNED OFFICER
            // =========================================

            modelBuilder.Entity<Complaint>()
                .HasOne(x => x.AssignedOfficer)
                .WithMany(x => x.Complaints)
                .HasForeignKey(x => x.AssignedOfficerId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}