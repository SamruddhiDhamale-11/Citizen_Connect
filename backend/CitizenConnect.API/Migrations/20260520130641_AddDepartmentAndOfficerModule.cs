using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CitizenConnect.API.Migrations
{
    /// <inheritdoc />
    public partial class AddDepartmentAndOfficerModule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Citizens_ResidenceTypes_ResidenceTypeId",
                table: "Citizens");

            migrationBuilder.DropForeignKey(
                name: "FK_Citizens_Users_UserId",
                table: "Citizens");

            migrationBuilder.DropForeignKey(
                name: "FK_Citizens_Wards_WardId",
                table: "Citizens");

            migrationBuilder.DropForeignKey(
                name: "FK_ComplaintImages_Complaints_ComplaintId",
                table: "ComplaintImages");

            migrationBuilder.DropForeignKey(
                name: "FK_Complaints_Citizens_CitizenId",
                table: "Complaints");

            migrationBuilder.DropForeignKey(
                name: "FK_Complaints_ComplaintCategories_ComplaintCategoryId",
                table: "Complaints");

            migrationBuilder.DropForeignKey(
                name: "FK_Complaints_Wards_WardId",
                table: "Complaints");

            migrationBuilder.DropForeignKey(
                name: "FK_ComplaintStatusHistories_Complaints_ComplaintId",
                table: "ComplaintStatusHistories");

            migrationBuilder.DropForeignKey(
                name: "FK_ComplaintStatusHistories_Users_ChangedByUserId",
                table: "ComplaintStatusHistories");

            migrationBuilder.DropForeignKey(
                name: "FK_Politicians_JurisdictionTypes_JurisdictionTypeId",
                table: "Politicians");

            migrationBuilder.DropForeignKey(
                name: "FK_Politicians_Users_UserId",
                table: "Politicians");

            migrationBuilder.DropForeignKey(
                name: "FK_Politicians_Wards_WardId",
                table: "Politicians");

            migrationBuilder.DropForeignKey(
                name: "FK_SuggestionStatusHistories_Users_ChangedByUserId",
                table: "SuggestionStatusHistories");

            migrationBuilder.DropForeignKey(
                name: "FK_SuggestionVotes_Citizens_CitizenId",
                table: "SuggestionVotes");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Roles_RoleId",
                table: "Users");

            migrationBuilder.DropForeignKey(
                name: "FK_Wards_JurisdictionTypes_JurisdictionTypeId",
                table: "Wards");

            migrationBuilder.AddColumn<DateTime>(
                name: "AssignedAt",
                table: "Complaints",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AssignedOfficerId",
                table: "Complaints",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DepartmentId",
                table: "Complaints",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DepartmentId",
                table: "ComplaintCategories",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SLAHours",
                table: "ComplaintCategories",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Departments",
                columns: table => new
                {
                    DepartmentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DepartmentName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Departments", x => x.DepartmentId);
                });

            migrationBuilder.CreateTable(
                name: "Officers",
                columns: table => new
                {
                    OfficerId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    MobileNumber = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    Designation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DepartmentId = table.Column<int>(type: "int", nullable: false),
                    IsAvailable = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Officers", x => x.OfficerId);
                    table.ForeignKey(
                        name: "FK_Officers_Departments_DepartmentId",
                        column: x => x.DepartmentId,
                        principalTable: "Departments",
                        principalColumn: "DepartmentId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Complaints_AssignedOfficerId",
                table: "Complaints",
                column: "AssignedOfficerId");

            migrationBuilder.CreateIndex(
                name: "IX_Complaints_DepartmentId",
                table: "Complaints",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_ComplaintCategories_DepartmentId",
                table: "ComplaintCategories",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Departments_DepartmentName",
                table: "Departments",
                column: "DepartmentName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Officers_DepartmentId",
                table: "Officers",
                column: "DepartmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Citizens_ResidenceTypes_ResidenceTypeId",
                table: "Citizens",
                column: "ResidenceTypeId",
                principalTable: "ResidenceTypes",
                principalColumn: "ResidenceTypeId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Citizens_Users_UserId",
                table: "Citizens",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Citizens_Wards_WardId",
                table: "Citizens",
                column: "WardId",
                principalTable: "Wards",
                principalColumn: "WardId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ComplaintCategories_Departments_DepartmentId",
                table: "ComplaintCategories",
                column: "DepartmentId",
                principalTable: "Departments",
                principalColumn: "DepartmentId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ComplaintImages_Complaints_ComplaintId",
                table: "ComplaintImages",
                column: "ComplaintId",
                principalTable: "Complaints",
                principalColumn: "ComplaintId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Complaints_Citizens_CitizenId",
                table: "Complaints",
                column: "CitizenId",
                principalTable: "Citizens",
                principalColumn: "CitizenId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Complaints_ComplaintCategories_ComplaintCategoryId",
                table: "Complaints",
                column: "ComplaintCategoryId",
                principalTable: "ComplaintCategories",
                principalColumn: "ComplaintCategoryId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Complaints_Departments_DepartmentId",
                table: "Complaints",
                column: "DepartmentId",
                principalTable: "Departments",
                principalColumn: "DepartmentId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Complaints_Officers_AssignedOfficerId",
                table: "Complaints",
                column: "AssignedOfficerId",
                principalTable: "Officers",
                principalColumn: "OfficerId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Complaints_Wards_WardId",
                table: "Complaints",
                column: "WardId",
                principalTable: "Wards",
                principalColumn: "WardId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ComplaintStatusHistories_Complaints_ComplaintId",
                table: "ComplaintStatusHistories",
                column: "ComplaintId",
                principalTable: "Complaints",
                principalColumn: "ComplaintId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ComplaintStatusHistories_Users_ChangedByUserId",
                table: "ComplaintStatusHistories",
                column: "ChangedByUserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Politicians_JurisdictionTypes_JurisdictionTypeId",
                table: "Politicians",
                column: "JurisdictionTypeId",
                principalTable: "JurisdictionTypes",
                principalColumn: "JurisdictionTypeId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Politicians_Users_UserId",
                table: "Politicians",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Politicians_Wards_WardId",
                table: "Politicians",
                column: "WardId",
                principalTable: "Wards",
                principalColumn: "WardId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SuggestionStatusHistories_Users_ChangedByUserId",
                table: "SuggestionStatusHistories",
                column: "ChangedByUserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SuggestionVotes_Citizens_CitizenId",
                table: "SuggestionVotes",
                column: "CitizenId",
                principalTable: "Citizens",
                principalColumn: "CitizenId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Roles_RoleId",
                table: "Users",
                column: "RoleId",
                principalTable: "Roles",
                principalColumn: "RoleId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Wards_JurisdictionTypes_JurisdictionTypeId",
                table: "Wards",
                column: "JurisdictionTypeId",
                principalTable: "JurisdictionTypes",
                principalColumn: "JurisdictionTypeId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Citizens_ResidenceTypes_ResidenceTypeId",
                table: "Citizens");

            migrationBuilder.DropForeignKey(
                name: "FK_Citizens_Users_UserId",
                table: "Citizens");

            migrationBuilder.DropForeignKey(
                name: "FK_Citizens_Wards_WardId",
                table: "Citizens");

            migrationBuilder.DropForeignKey(
                name: "FK_ComplaintCategories_Departments_DepartmentId",
                table: "ComplaintCategories");

            migrationBuilder.DropForeignKey(
                name: "FK_ComplaintImages_Complaints_ComplaintId",
                table: "ComplaintImages");

            migrationBuilder.DropForeignKey(
                name: "FK_Complaints_Citizens_CitizenId",
                table: "Complaints");

            migrationBuilder.DropForeignKey(
                name: "FK_Complaints_ComplaintCategories_ComplaintCategoryId",
                table: "Complaints");

            migrationBuilder.DropForeignKey(
                name: "FK_Complaints_Departments_DepartmentId",
                table: "Complaints");

            migrationBuilder.DropForeignKey(
                name: "FK_Complaints_Officers_AssignedOfficerId",
                table: "Complaints");

            migrationBuilder.DropForeignKey(
                name: "FK_Complaints_Wards_WardId",
                table: "Complaints");

            migrationBuilder.DropForeignKey(
                name: "FK_ComplaintStatusHistories_Complaints_ComplaintId",
                table: "ComplaintStatusHistories");

            migrationBuilder.DropForeignKey(
                name: "FK_ComplaintStatusHistories_Users_ChangedByUserId",
                table: "ComplaintStatusHistories");

            migrationBuilder.DropForeignKey(
                name: "FK_Politicians_JurisdictionTypes_JurisdictionTypeId",
                table: "Politicians");

            migrationBuilder.DropForeignKey(
                name: "FK_Politicians_Users_UserId",
                table: "Politicians");

            migrationBuilder.DropForeignKey(
                name: "FK_Politicians_Wards_WardId",
                table: "Politicians");

            migrationBuilder.DropForeignKey(
                name: "FK_SuggestionStatusHistories_Users_ChangedByUserId",
                table: "SuggestionStatusHistories");

            migrationBuilder.DropForeignKey(
                name: "FK_SuggestionVotes_Citizens_CitizenId",
                table: "SuggestionVotes");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Roles_RoleId",
                table: "Users");

            migrationBuilder.DropForeignKey(
                name: "FK_Wards_JurisdictionTypes_JurisdictionTypeId",
                table: "Wards");

            migrationBuilder.DropTable(
                name: "Officers");

            migrationBuilder.DropTable(
                name: "Departments");

            migrationBuilder.DropIndex(
                name: "IX_Complaints_AssignedOfficerId",
                table: "Complaints");

            migrationBuilder.DropIndex(
                name: "IX_Complaints_DepartmentId",
                table: "Complaints");

            migrationBuilder.DropIndex(
                name: "IX_ComplaintCategories_DepartmentId",
                table: "ComplaintCategories");

            migrationBuilder.DropColumn(
                name: "AssignedAt",
                table: "Complaints");

            migrationBuilder.DropColumn(
                name: "AssignedOfficerId",
                table: "Complaints");

            migrationBuilder.DropColumn(
                name: "DepartmentId",
                table: "Complaints");

            migrationBuilder.DropColumn(
                name: "DepartmentId",
                table: "ComplaintCategories");

            migrationBuilder.DropColumn(
                name: "SLAHours",
                table: "ComplaintCategories");

            migrationBuilder.AddForeignKey(
                name: "FK_Citizens_ResidenceTypes_ResidenceTypeId",
                table: "Citizens",
                column: "ResidenceTypeId",
                principalTable: "ResidenceTypes",
                principalColumn: "ResidenceTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Citizens_Users_UserId",
                table: "Citizens",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Citizens_Wards_WardId",
                table: "Citizens",
                column: "WardId",
                principalTable: "Wards",
                principalColumn: "WardId");

            migrationBuilder.AddForeignKey(
                name: "FK_ComplaintImages_Complaints_ComplaintId",
                table: "ComplaintImages",
                column: "ComplaintId",
                principalTable: "Complaints",
                principalColumn: "ComplaintId");

            migrationBuilder.AddForeignKey(
                name: "FK_Complaints_Citizens_CitizenId",
                table: "Complaints",
                column: "CitizenId",
                principalTable: "Citizens",
                principalColumn: "CitizenId");

            migrationBuilder.AddForeignKey(
                name: "FK_Complaints_ComplaintCategories_ComplaintCategoryId",
                table: "Complaints",
                column: "ComplaintCategoryId",
                principalTable: "ComplaintCategories",
                principalColumn: "ComplaintCategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Complaints_Wards_WardId",
                table: "Complaints",
                column: "WardId",
                principalTable: "Wards",
                principalColumn: "WardId");

            migrationBuilder.AddForeignKey(
                name: "FK_ComplaintStatusHistories_Complaints_ComplaintId",
                table: "ComplaintStatusHistories",
                column: "ComplaintId",
                principalTable: "Complaints",
                principalColumn: "ComplaintId");

            migrationBuilder.AddForeignKey(
                name: "FK_ComplaintStatusHistories_Users_ChangedByUserId",
                table: "ComplaintStatusHistories",
                column: "ChangedByUserId",
                principalTable: "Users",
                principalColumn: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Politicians_JurisdictionTypes_JurisdictionTypeId",
                table: "Politicians",
                column: "JurisdictionTypeId",
                principalTable: "JurisdictionTypes",
                principalColumn: "JurisdictionTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Politicians_Users_UserId",
                table: "Politicians",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Politicians_Wards_WardId",
                table: "Politicians",
                column: "WardId",
                principalTable: "Wards",
                principalColumn: "WardId");

            migrationBuilder.AddForeignKey(
                name: "FK_SuggestionStatusHistories_Users_ChangedByUserId",
                table: "SuggestionStatusHistories",
                column: "ChangedByUserId",
                principalTable: "Users",
                principalColumn: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_SuggestionVotes_Citizens_CitizenId",
                table: "SuggestionVotes",
                column: "CitizenId",
                principalTable: "Citizens",
                principalColumn: "CitizenId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Roles_RoleId",
                table: "Users",
                column: "RoleId",
                principalTable: "Roles",
                principalColumn: "RoleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Wards_JurisdictionTypes_JurisdictionTypeId",
                table: "Wards",
                column: "JurisdictionTypeId",
                principalTable: "JurisdictionTypes",
                principalColumn: "JurisdictionTypeId");
        }
    }
}
