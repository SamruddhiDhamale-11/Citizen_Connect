using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CitizenConnect.API.Migrations
{
    /// <inheritdoc />
    public partial class AddFacilityRecord : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Citizens_Localities_LocalityId",
                table: "Citizens");

            migrationBuilder.DropForeignKey(
                name: "FK_Complaints_Localities_LocalityId",
                table: "Complaints");

            migrationBuilder.DropForeignKey(
                name: "FK_FacilityDatas_FacilityModules_FacilityModuleId",
                table: "FacilityDatas");

            migrationBuilder.DropForeignKey(
                name: "FK_FacilityDatas_Jurisdictions_JurisdictionId",
                table: "FacilityDatas");

            migrationBuilder.DropForeignKey(
                name: "FK_FacilityDatas_Wards_WardId",
                table: "FacilityDatas");

            migrationBuilder.DropForeignKey(
                name: "FK_Wards_JurisdictionTypes_JurisdictionTypeId",
                table: "Wards");

            migrationBuilder.DropForeignKey(
                name: "FK_Wards_Jurisdictions_JurisdictionId",
                table: "Wards");

            migrationBuilder.DropIndex(
                name: "IX_Wards_JurisdictionId",
                table: "Wards");

            migrationBuilder.DropIndex(
                name: "IX_Wards_JurisdictionTypeId_WardNumber",
                table: "Wards");

            migrationBuilder.DropIndex(
                name: "IX_FacilityDatas_JurisdictionId_WardId_FacilityModuleId",
                table: "FacilityDatas");

            migrationBuilder.DropIndex(
                name: "IX_FacilityDatas_JurisdictionId_WardId_FacilityModuleId_FacilityFieldId",
                table: "FacilityDatas");

            migrationBuilder.AlterColumn<int>(
                name: "JurisdictionTypeId",
                table: "Wards",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "JurisdictionId",
                table: "Wards",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "JurisdictionId",
                table: "FacilityDatas",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "FacilityModuleId",
                table: "FacilityDatas",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
    name: "FacilityRecordId",
    table: "FacilityDatas",
    type: "int",
    nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "LocalityId",
                table: "Complaints",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);


            migrationBuilder.AlterColumn<int>(
                name: "LocalityId",
                table: "Citizens",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "FacilityRecords",
                columns: table => new
                {
                    FacilityRecordId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FacilityModuleId = table.Column<int>(type: "int", nullable: false),
                    JurisdictionId = table.Column<int>(type: "int", nullable: false),
                    WardId = table.Column<int>(type: "int", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FacilityRecords", x => x.FacilityRecordId);
                    table.ForeignKey(
                        name: "FK_FacilityRecords_FacilityModules_FacilityModuleId",
                        column: x => x.FacilityModuleId,
                        principalTable: "FacilityModules",
                        principalColumn: "FacilityModuleId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FacilityRecords_Jurisdictions_JurisdictionId",
                        column: x => x.JurisdictionId,
                        principalTable: "Jurisdictions",
                        principalColumn: "JurisdictionId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FacilityRecords_Wards_WardId",
                        column: x => x.WardId,
                        principalTable: "Wards",
                        principalColumn: "WardId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Wards_JurisdictionId_WardNumber",
                table: "Wards",
                columns: new[] { "JurisdictionId", "WardNumber" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Wards_JurisdictionTypeId",
                table: "Wards",
                column: "JurisdictionTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_FacilityDatas_FacilityRecordId",
                table: "FacilityDatas",
                column: "FacilityRecordId");

            migrationBuilder.CreateIndex(
                name: "IX_FacilityRecords_FacilityModuleId",
                table: "FacilityRecords",
                column: "FacilityModuleId");

            migrationBuilder.CreateIndex(
                name: "IX_FacilityRecords_JurisdictionId",
                table: "FacilityRecords",
                column: "JurisdictionId");

            migrationBuilder.CreateIndex(
                name: "IX_FacilityRecords_WardId",
                table: "FacilityRecords",
                column: "WardId");

            migrationBuilder.AddForeignKey(
                name: "FK_Citizens_Localities_LocalityId",
                table: "Citizens",
                column: "LocalityId",
                principalTable: "Localities",
                principalColumn: "LocalityId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Complaints_Localities_LocalityId",
                table: "Complaints",
                column: "LocalityId",
                principalTable: "Localities",
                principalColumn: "LocalityId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_FacilityDatas_FacilityModules_FacilityModuleId",
                table: "FacilityDatas",
                column: "FacilityModuleId",
                principalTable: "FacilityModules",
                principalColumn: "FacilityModuleId");

          

            migrationBuilder.AddForeignKey(
                name: "FK_FacilityDatas_Jurisdictions_JurisdictionId",
                table: "FacilityDatas",
                column: "JurisdictionId",
                principalTable: "Jurisdictions",
                principalColumn: "JurisdictionId");

            migrationBuilder.AddForeignKey(
                name: "FK_FacilityDatas_Wards_WardId",
                table: "FacilityDatas",
                column: "WardId",
                principalTable: "Wards",
                principalColumn: "WardId");

            migrationBuilder.AddForeignKey(
                name: "FK_Wards_JurisdictionTypes_JurisdictionTypeId",
                table: "Wards",
                column: "JurisdictionTypeId",
                principalTable: "JurisdictionTypes",
                principalColumn: "JurisdictionTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Wards_Jurisdictions_JurisdictionId",
                table: "Wards",
                column: "JurisdictionId",
                principalTable: "Jurisdictions",
                principalColumn: "JurisdictionId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Citizens_Localities_LocalityId",
                table: "Citizens");

            migrationBuilder.DropForeignKey(
                name: "FK_Complaints_Localities_LocalityId",
                table: "Complaints");

            migrationBuilder.DropForeignKey(
                name: "FK_FacilityDatas_FacilityModules_FacilityModuleId",
                table: "FacilityDatas");

           

            migrationBuilder.DropForeignKey(
                name: "FK_FacilityDatas_Jurisdictions_JurisdictionId",
                table: "FacilityDatas");

            migrationBuilder.DropForeignKey(
                name: "FK_FacilityDatas_Wards_WardId",
                table: "FacilityDatas");

            migrationBuilder.DropForeignKey(
                name: "FK_Wards_JurisdictionTypes_JurisdictionTypeId",
                table: "Wards");

            migrationBuilder.DropForeignKey(
                name: "FK_Wards_Jurisdictions_JurisdictionId",
                table: "Wards");

            migrationBuilder.DropTable(
                name: "FacilityRecords");

            migrationBuilder.DropIndex(
                name: "IX_Wards_JurisdictionId_WardNumber",
                table: "Wards");

            migrationBuilder.DropIndex(
                name: "IX_Wards_JurisdictionTypeId",
                table: "Wards");

            migrationBuilder.DropIndex(
                name: "IX_FacilityDatas_FacilityRecordId",
                table: "FacilityDatas");

            migrationBuilder.DropIndex(
                name: "IX_FacilityDatas_FacilityRecordId_FacilityFieldId",
                table: "FacilityDatas");

            migrationBuilder.DropColumn(
                name: "FacilityRecordId",
                table: "FacilityDatas");

            

            migrationBuilder.AlterColumn<int>(
                name: "JurisdictionTypeId",
                table: "Wards",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "JurisdictionId",
                table: "Wards",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "JurisdictionId",
                table: "FacilityDatas",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "FacilityModuleId",
                table: "FacilityDatas",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "LocalityId",
                table: "Complaints",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "LocalityId",
                table: "Citizens",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

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
                name: "IX_FacilityDatas_JurisdictionId_WardId_FacilityModuleId",
                table: "FacilityDatas",
                columns: new[] { "JurisdictionId", "WardId", "FacilityModuleId" });

            migrationBuilder.CreateIndex(
                name: "IX_FacilityDatas_JurisdictionId_WardId_FacilityModuleId_FacilityFieldId",
                table: "FacilityDatas",
                columns: new[] { "JurisdictionId", "WardId", "FacilityModuleId", "FacilityFieldId" },
                unique: true,
                filter: "[WardId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Citizens_Localities_LocalityId",
                table: "Citizens",
                column: "LocalityId",
                principalTable: "Localities",
                principalColumn: "LocalityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Complaints_Localities_LocalityId",
                table: "Complaints",
                column: "LocalityId",
                principalTable: "Localities",
                principalColumn: "LocalityId");

            migrationBuilder.AddForeignKey(
                name: "FK_FacilityDatas_FacilityModules_FacilityModuleId",
                table: "FacilityDatas",
                column: "FacilityModuleId",
                principalTable: "FacilityModules",
                principalColumn: "FacilityModuleId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_FacilityDatas_Jurisdictions_JurisdictionId",
                table: "FacilityDatas",
                column: "JurisdictionId",
                principalTable: "Jurisdictions",
                principalColumn: "JurisdictionId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_FacilityDatas_Wards_WardId",
                table: "FacilityDatas",
                column: "WardId",
                principalTable: "Wards",
                principalColumn: "WardId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Wards_JurisdictionTypes_JurisdictionTypeId",
                table: "Wards",
                column: "JurisdictionTypeId",
                principalTable: "JurisdictionTypes",
                principalColumn: "JurisdictionTypeId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Wards_Jurisdictions_JurisdictionId",
                table: "Wards",
                column: "JurisdictionId",
                principalTable: "Jurisdictions",
                principalColumn: "JurisdictionId");
        }
    }
}
