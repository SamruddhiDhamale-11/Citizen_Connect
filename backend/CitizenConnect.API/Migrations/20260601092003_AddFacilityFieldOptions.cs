using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CitizenConnect.API.Migrations
{
    /// <inheritdoc />
    public partial class AddFacilityFieldOptions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Suggestions_Citizens_CitizenId",
                table: "Suggestions");

            migrationBuilder.DropForeignKey(
                name: "FK_SuggestionVotes_Suggestions_SuggestionId",
                table: "SuggestionVotes");

            migrationBuilder.DropIndex(
                name: "IX_Wards_JurisdictionTypeId",
                table: "Wards");

            migrationBuilder.DropIndex(
                name: "IX_Wards_WardNumber",
                table: "Wards");

            migrationBuilder.DropIndex(
                name: "IX_WardDepartments_WardId",
                table: "WardDepartments");

            migrationBuilder.DropColumn(
                name: "PartName",
                table: "Politicians");

            migrationBuilder.DropColumn(
                name: "WardName",
                table: "Politicians");

            migrationBuilder.DropColumn(
                name: "WardNumber",
                table: "Politicians");

            migrationBuilder.AddColumn<int>(
                name: "JurisdictionId",
                table: "Wards",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "StatusName",
                table: "SuggestionStatusMasters",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "SuggestionStatusMasters",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(250)",
                oldMaxLength: 250,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "RoleName",
                table: "Roles",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "PoliticianRole",
                table: "Politicians",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "PartyName",
                table: "Politicians",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "GovernmentId",
                table: "Politicians",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Gender",
                table: "Politicians",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Address",
                table: "Politicians",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<int>(
                name: "JurisdictionId",
                table: "Politicians",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "JurisdictionTypeName",
                table: "JurisdictionTypes",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "JurisdictionDescription",
                table: "JurisdictionTypes",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "StatusName",
                table: "ComplaintStatusMasters",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "ComplaintStatusMasters",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(250)",
                oldMaxLength: 250,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Longitude",
                table: "Complaints",
                type: "decimal(9,6)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,6)");

            migrationBuilder.AlterColumn<decimal>(
                name: "Latitude",
                table: "Complaints",
                type: "decimal(9,6)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,6)");

            migrationBuilder.AlterColumn<string>(
                name: "ComplaintNumber",
                table: "Complaints",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.CreateTable(
                name: "FacilityModules",
                columns: table => new
                {
                    FacilityModuleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ModuleName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    ModuleDescription = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IconName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FacilityModules", x => x.FacilityModuleId);
                });

            migrationBuilder.CreateTable(
                name: "Jurisdictions",
                columns: table => new
                {
                    JurisdictionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    JurisdictionName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    JurisdictionTypeId = table.Column<int>(type: "int", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Latitude = table.Column<decimal>(type: "decimal(9,6)", nullable: false),
                    Longitude = table.Column<decimal>(type: "decimal(9,6)", nullable: false),
                    Pincode = table.Column<string>(type: "char(6)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Jurisdictions", x => x.JurisdictionId);
                    table.ForeignKey(
                        name: "FK_Jurisdictions_JurisdictionTypes_JurisdictionTypeId",
                        column: x => x.JurisdictionTypeId,
                        principalTable: "JurisdictionTypes",
                        principalColumn: "JurisdictionTypeId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "FacilityFields",
                columns: table => new
                {
                    FacilityFieldId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FacilityModuleId = table.Column<int>(type: "int", nullable: false),
                    FieldName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    FieldType = table.Column<int>(type: "int", maxLength: 50, nullable: false),
                    IsRequired = table.Column<bool>(type: "bit", nullable: false),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    Placeholder = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FacilityFields", x => x.FacilityFieldId);
                    table.ForeignKey(
                        name: "FK_FacilityFields_FacilityModules_FacilityModuleId",
                        column: x => x.FacilityModuleId,
                        principalTable: "FacilityModules",
                        principalColumn: "FacilityModuleId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FacilityDatas",
                columns: table => new
                {
                    FacilityDataId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FacilityModuleId = table.Column<int>(type: "int", nullable: false),
                    FacilityFieldId = table.Column<int>(type: "int", nullable: false),
                    JurisdictionId = table.Column<int>(type: "int", nullable: false),
                    WardId = table.Column<int>(type: "int", nullable: true),
                    FieldValue = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FacilityDatas", x => x.FacilityDataId);
                    table.ForeignKey(
                        name: "FK_FacilityDatas_FacilityFields_FacilityFieldId",
                        column: x => x.FacilityFieldId,
                        principalTable: "FacilityFields",
                        principalColumn: "FacilityFieldId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FacilityDatas_FacilityModules_FacilityModuleId",
                        column: x => x.FacilityModuleId,
                        principalTable: "FacilityModules",
                        principalColumn: "FacilityModuleId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FacilityDatas_Jurisdictions_JurisdictionId",
                        column: x => x.JurisdictionId,
                        principalTable: "Jurisdictions",
                        principalColumn: "JurisdictionId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FacilityDatas_Wards_WardId",
                        column: x => x.WardId,
                        principalTable: "Wards",
                        principalColumn: "WardId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "FacilityFieldOptions",
                columns: table => new
                {
                    FacilityFieldOptionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FacilityFieldId = table.Column<int>(type: "int", nullable: false),
                    OptionText = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FacilityFieldOptions", x => x.FacilityFieldOptionId);
                    table.ForeignKey(
                        name: "FK_FacilityFieldOptions_FacilityFields_FacilityFieldId",
                        column: x => x.FacilityFieldId,
                        principalTable: "FacilityFields",
                        principalColumn: "FacilityFieldId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Wards_JurisdictionId",
                table: "Wards",
                column: "JurisdictionId");

            migrationBuilder.CreateIndex(
                name: "IX_Wards_JurisdictionTypeId_WardNumber",
                table: "Wards",
                columns: new[] { "JurisdictionTypeId", "WardNumber" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WardDepartments_WardId_DepartmentId",
                table: "WardDepartments",
                columns: new[] { "WardId", "DepartmentId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Suggestions_CreatedAt",
                table: "Suggestions",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Roles_RoleName",
                table: "Roles",
                column: "RoleName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Politicians_GovernmentId",
                table: "Politicians",
                column: "GovernmentId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Politicians_JurisdictionId",
                table: "Politicians",
                column: "JurisdictionId");

            migrationBuilder.CreateIndex(
                name: "IX_Officers_Email",
                table: "Officers",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Officers_MobileNumber",
                table: "Officers",
                column: "MobileNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_JurisdictionTypes_JurisdictionTypeName",
                table: "JurisdictionTypes",
                column: "JurisdictionTypeName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Complaints_CreatedAt",
                table: "Complaints",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_FacilityDatas_CreatedAt",
                table: "FacilityDatas",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_FacilityDatas_FacilityFieldId",
                table: "FacilityDatas",
                column: "FacilityFieldId");

            migrationBuilder.CreateIndex(
                name: "IX_FacilityDatas_FacilityModuleId",
                table: "FacilityDatas",
                column: "FacilityModuleId");

            migrationBuilder.CreateIndex(
                name: "IX_FacilityDatas_JurisdictionId",
                table: "FacilityDatas",
                column: "JurisdictionId");

            migrationBuilder.CreateIndex(
                name: "IX_FacilityDatas_JurisdictionId_WardId_FacilityModuleId",
                table: "FacilityDatas",
                columns: new[] { "JurisdictionId", "WardId", "FacilityModuleId" });

            migrationBuilder.CreateIndex(
                name: "IX_FacilityDatas_JurisdictionId_WardId_FacilityModuleId_FacilityFieldId",
                table: "FacilityDatas",
                columns: new[] { "JurisdictionId", "WardId", "FacilityModuleId", "FacilityFieldId" },
                unique: true,
                filter: "[WardId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_FacilityDatas_WardId",
                table: "FacilityDatas",
                column: "WardId");

            migrationBuilder.CreateIndex(
                name: "IX_FacilityFieldOptions_FacilityFieldId_OptionText",
                table: "FacilityFieldOptions",
                columns: new[] { "FacilityFieldId", "OptionText" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FacilityFields_FacilityModuleId_FieldName",
                table: "FacilityFields",
                columns: new[] { "FacilityModuleId", "FieldName" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FacilityModules_ModuleName",
                table: "FacilityModules",
                column: "ModuleName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Jurisdictions_JurisdictionName",
                table: "Jurisdictions",
                column: "JurisdictionName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Jurisdictions_JurisdictionTypeId",
                table: "Jurisdictions",
                column: "JurisdictionTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Politicians_Jurisdictions_JurisdictionId",
                table: "Politicians",
                column: "JurisdictionId",
                principalTable: "Jurisdictions",
                principalColumn: "JurisdictionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Suggestions_Citizens_CitizenId",
                table: "Suggestions",
                column: "CitizenId",
                principalTable: "Citizens",
                principalColumn: "CitizenId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SuggestionVotes_Suggestions_SuggestionId",
                table: "SuggestionVotes",
                column: "SuggestionId",
                principalTable: "Suggestions",
                principalColumn: "SuggestionId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Wards_Jurisdictions_JurisdictionId",
                table: "Wards",
                column: "JurisdictionId",
                principalTable: "Jurisdictions",
                principalColumn: "JurisdictionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Politicians_Jurisdictions_JurisdictionId",
                table: "Politicians");

            migrationBuilder.DropForeignKey(
                name: "FK_Suggestions_Citizens_CitizenId",
                table: "Suggestions");

            migrationBuilder.DropForeignKey(
                name: "FK_SuggestionVotes_Suggestions_SuggestionId",
                table: "SuggestionVotes");

            migrationBuilder.DropForeignKey(
                name: "FK_Wards_Jurisdictions_JurisdictionId",
                table: "Wards");

            migrationBuilder.DropTable(
                name: "FacilityDatas");

            migrationBuilder.DropTable(
                name: "FacilityFieldOptions");

            migrationBuilder.DropTable(
                name: "Jurisdictions");

            migrationBuilder.DropTable(
                name: "FacilityFields");

            migrationBuilder.DropTable(
                name: "FacilityModules");

            migrationBuilder.DropIndex(
                name: "IX_Wards_JurisdictionId",
                table: "Wards");

            migrationBuilder.DropIndex(
                name: "IX_Wards_JurisdictionTypeId_WardNumber",
                table: "Wards");

            migrationBuilder.DropIndex(
                name: "IX_WardDepartments_WardId_DepartmentId",
                table: "WardDepartments");

            migrationBuilder.DropIndex(
                name: "IX_Suggestions_CreatedAt",
                table: "Suggestions");

            migrationBuilder.DropIndex(
                name: "IX_Roles_RoleName",
                table: "Roles");

            migrationBuilder.DropIndex(
                name: "IX_Politicians_GovernmentId",
                table: "Politicians");

            migrationBuilder.DropIndex(
                name: "IX_Politicians_JurisdictionId",
                table: "Politicians");

            migrationBuilder.DropIndex(
                name: "IX_Officers_Email",
                table: "Officers");

            migrationBuilder.DropIndex(
                name: "IX_Officers_MobileNumber",
                table: "Officers");

            migrationBuilder.DropIndex(
                name: "IX_JurisdictionTypes_JurisdictionTypeName",
                table: "JurisdictionTypes");

            migrationBuilder.DropIndex(
                name: "IX_Complaints_CreatedAt",
                table: "Complaints");

            migrationBuilder.DropColumn(
                name: "JurisdictionId",
                table: "Wards");

            migrationBuilder.DropColumn(
                name: "JurisdictionId",
                table: "Politicians");

            migrationBuilder.AlterColumn<string>(
                name: "StatusName",
                table: "SuggestionStatusMasters",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "SuggestionStatusMasters",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "RoleName",
                table: "Roles",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "PoliticianRole",
                table: "Politicians",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "PartyName",
                table: "Politicians",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "GovernmentId",
                table: "Politicians",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Gender",
                table: "Politicians",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20);

            migrationBuilder.AlterColumn<string>(
                name: "Address",
                table: "Politicians",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500);

            migrationBuilder.AddColumn<string>(
                name: "PartName",
                table: "Politicians",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "WardName",
                table: "Politicians",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "WardNumber",
                table: "Politicians",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "JurisdictionTypeName",
                table: "JurisdictionTypes",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "JurisdictionDescription",
                table: "JurisdictionTypes",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "StatusName",
                table: "ComplaintStatusMasters",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "ComplaintStatusMasters",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Longitude",
                table: "Complaints",
                type: "decimal(18,6)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(9,6)");

            migrationBuilder.AlterColumn<decimal>(
                name: "Latitude",
                table: "Complaints",
                type: "decimal(18,6)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(9,6)");

            migrationBuilder.AlterColumn<string>(
                name: "ComplaintNumber",
                table: "Complaints",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.CreateIndex(
                name: "IX_Wards_JurisdictionTypeId",
                table: "Wards",
                column: "JurisdictionTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Wards_WardNumber",
                table: "Wards",
                column: "WardNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WardDepartments_WardId",
                table: "WardDepartments",
                column: "WardId");

            migrationBuilder.AddForeignKey(
                name: "FK_Suggestions_Citizens_CitizenId",
                table: "Suggestions",
                column: "CitizenId",
                principalTable: "Citizens",
                principalColumn: "CitizenId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SuggestionVotes_Suggestions_SuggestionId",
                table: "SuggestionVotes",
                column: "SuggestionId",
                principalTable: "Suggestions",
                principalColumn: "SuggestionId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
