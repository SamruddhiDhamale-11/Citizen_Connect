using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CitizenConnect.API.Migrations
{
    /// <inheritdoc />
    public partial class AddLocalityModule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LocalityId",
                table: "Complaints",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "DepartmentId",
                table: "ComplaintCategories",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LocalityId",
                table: "Citizens",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "LocalityTypes",
                columns: table => new
                {
                    LocalityTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TypeName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LocalityTypes", x => x.LocalityTypeId);
                });

            migrationBuilder.CreateTable(
                name: "Localities",
                columns: table => new
                {
                    LocalityId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LocalityName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    WardId = table.Column<int>(type: "int", nullable: false),
                    LocalityTypeId = table.Column<int>(type: "int", nullable: false),
                    Latitude = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Longitude = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Pincode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Landmark = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Localities", x => x.LocalityId);
                    table.ForeignKey(
                        name: "FK_Localities_LocalityTypes_LocalityTypeId",
                        column: x => x.LocalityTypeId,
                        principalTable: "LocalityTypes",
                        principalColumn: "LocalityTypeId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Localities_Wards_WardId",
                        column: x => x.WardId,
                        principalTable: "Wards",
                        principalColumn: "WardId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Complaints_LocalityId",
                table: "Complaints",
                column: "LocalityId");

            migrationBuilder.CreateIndex(
                name: "IX_Citizens_LocalityId",
                table: "Citizens",
                column: "LocalityId");

            migrationBuilder.CreateIndex(
                name: "IX_Localities_LocalityTypeId",
                table: "Localities",
                column: "LocalityTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Localities_WardId",
                table: "Localities",
                column: "WardId");

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

            migrationBuilder.DropTable(
                name: "Localities");

            migrationBuilder.DropTable(
                name: "LocalityTypes");

            migrationBuilder.DropIndex(
                name: "IX_Complaints_LocalityId",
                table: "Complaints");

            migrationBuilder.DropIndex(
                name: "IX_Citizens_LocalityId",
                table: "Citizens");

            migrationBuilder.DropColumn(
                name: "LocalityId",
                table: "Complaints");

            migrationBuilder.DropColumn(
                name: "LocalityId",
                table: "Citizens");

            migrationBuilder.AlterColumn<int>(
                name: "DepartmentId",
                table: "ComplaintCategories",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}
