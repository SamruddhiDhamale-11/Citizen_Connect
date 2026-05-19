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

        // ==============================
        // DB SETS
        // ==============================

        public DbSet<User> Users => Set<User>();

        public DbSet<Role> Roles => Set<Role>();

        public DbSet<Citizen> Citizens => Set<Citizen>();

        public DbSet<Politician> Politicians => Set<Politician>();

        public DbSet<Ward> Wards => Set<Ward>();

        public DbSet<ResidenceType> ResidenceTypes => Set<ResidenceType>();

        public DbSet<JurisdictionType> JurisdictionTypes => Set<JurisdictionType>();

        public DbSet<Complaint> Complaints => Set<Complaint>();

        public DbSet<ComplaintCategory> ComplaintCategories => Set<ComplaintCategory>();

        public DbSet<ComplaintImage> ComplaintImages => Set<ComplaintImage>();

        public DbSet<ComplaintStatusHistory> ComplaintStatusHistories => Set<ComplaintStatusHistory>();


        // ==============================
        // MODEL CONFIGURATION
        // ==============================

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ==============================
            // ROLE -> USERS
            // ==============================

            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId)
                .OnDelete(DeleteBehavior.NoAction);


            // ==============================
            // USER -> CITIZEN (ONE TO ONE)
            // ==============================

            modelBuilder.Entity<Citizen>()
                .HasOne(c => c.User)
                .WithOne(u => u.Citizen)
                .HasForeignKey<Citizen>(c => c.UserId)
                .OnDelete(DeleteBehavior.NoAction);


            // ==============================
            // USER -> POLITICIAN (ONE TO ONE)
            // ==============================

            modelBuilder.Entity<Politician>()
                .HasOne(p => p.User)
                .WithOne(u => u.Politician)
                .HasForeignKey<Politician>(p => p.UserId)
                .OnDelete(DeleteBehavior.NoAction);


            // ==============================
            // CITIZEN -> WARD
            // ==============================

            modelBuilder.Entity<Citizen>()
                .HasOne(c => c.Ward)
                .WithMany(w => w.Citizens)
                .HasForeignKey(c => c.WardId)
                .OnDelete(DeleteBehavior.NoAction);


            // ==============================
            // CITIZEN -> RESIDENCE TYPE
            // ==============================

            modelBuilder.Entity<Citizen>()
                .HasOne(c => c.ResidenceType)
                .WithMany(r => r.Citizens)
                .HasForeignKey(c => c.ResidenceTypeId)
                .OnDelete(DeleteBehavior.NoAction);


            // ==============================
            // POLITICIAN -> WARD
            // ==============================
            // WardId is optional — politicians identify their ward via
            // WardNumber/WardName text fields; the ward dropdown was removed.
            modelBuilder.Entity<Politician>()
                .HasOne(p => p.Ward)
                .WithMany(w => w.Politicians)
                .HasForeignKey(p => p.WardId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.NoAction);


            // ==============================
            // POLITICIAN -> JURISDICTION TYPE
            // ==============================

            modelBuilder.Entity<Politician>()
                .HasOne(p => p.JurisdictionType)
                .WithMany(j => j.Politicians)
                .HasForeignKey(p => p.JurisdictionTypeId)
                .OnDelete(DeleteBehavior.NoAction);


            // ==============================
            // WARD -> JURISDICTION TYPE
            // ==============================

            modelBuilder.Entity<Ward>()
                .HasOne(w => w.JurisdictionType)
                .WithMany(j => j.Wards)
                .HasForeignKey(w => w.JurisdictionTypeId)
                .OnDelete(DeleteBehavior.NoAction);


            // ==============================
            // UNIQUE CONSTRAINTS
            // ==============================

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.MobileNo)
                .IsUnique();


            // ==============================
            // COLUMN CONFIGURATIONS
            // ==============================

            modelBuilder.Entity<User>()
                .Property(u => u.FirstName)
                .HasMaxLength(100);

            modelBuilder.Entity<User>()
                .Property(u => u.LastName)
                .HasMaxLength(100);

            modelBuilder.Entity<User>()
                .Property(u => u.MobileNo)
                .HasMaxLength(15);

            modelBuilder.Entity<User>()
                .Property(u => u.Email)
                .HasMaxLength(150);

            modelBuilder.Entity<Ward>()
                .Property(w => w.Latitude)
                .HasColumnType("decimal(18,6)");

            modelBuilder.Entity<Ward>()
                .Property(w => w.Longitude)
                .HasColumnType("decimal(18,6)");

            modelBuilder.Entity<Complaint>()
    .HasOne(c => c.Citizen)
    .WithMany(c => c.Complaints)
    .HasForeignKey(c => c.CitizenId)
    .OnDelete(DeleteBehavior.NoAction);


            modelBuilder.Entity<Complaint>()
    .HasOne(c => c.Ward)
    .WithMany(w => w.Complaints)
    .HasForeignKey(c => c.WardId)
    .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Complaint>()
    .HasOne(c => c.ComplaintCategory)
    .WithMany(cc => cc.Complaints)
    .HasForeignKey(c => c.ComplaintCategoryId)
    .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<ComplaintImage>()
    .HasOne(ci => ci.Complaint)
    .WithMany(c => c.ComplaintImages)
    .HasForeignKey(ci => ci.ComplaintId)
    .OnDelete(DeleteBehavior.NoAction);


            modelBuilder.Entity<Complaint>()
    .Property(c => c.Latitude)
    .HasColumnType("decimal(18,6)");

            modelBuilder.Entity<Complaint>()
                .Property(c => c.Longitude)
                .HasColumnType("decimal(18,6)");


            modelBuilder.Entity<Complaint>()
    .HasIndex(c => c.ComplaintNumber)
    .IsUnique();


            modelBuilder.Entity<ComplaintStatusHistory>()
    .HasOne(h => h.Complaint)
    .WithMany(c => c.ComplaintStatusHistories)
    .HasForeignKey(h => h.ComplaintId)
    .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<ComplaintStatusHistory>()
    .HasOne(h => h.ChangedByUser)
    .WithMany(u => u.ComplaintStatusHistories)
    .HasForeignKey(h => h.ChangedByUserId)
    .OnDelete(DeleteBehavior.NoAction);


        }
    }
}