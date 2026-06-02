using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CitizenConnect.API.Migrations
{
    /// <inheritdoc />
    public partial class AddDemographics : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Demographics",
                columns: table => new
                {
                    DemographicId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    JurisdictionId = table.Column<int>(type: "int", nullable: false),
                    WardId = table.Column<int>(type: "int", nullable: true),
                    TotalPopulation = table.Column<int>(type: "int", nullable: false),
                    MalePopulation = table.Column<int>(type: "int", nullable: false),
                    FemalePopulation = table.Column<int>(type: "int", nullable: false),
                    ChildPopulation = table.Column<int>(type: "int", nullable: false),
                    SeniorCitizenPopulation = table.Column<int>(type: "int", nullable: false),
                    TotalHouseholds = table.Column<int>(type: "int", nullable: false),
                    MaleLiteracyRate = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    FemaleLiteracyRate = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    TotalLiteracyRate = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    TotalVoters = table.Column<int>(type: "int", nullable: false),
                    SurveyYear = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Demographics", x => x.DemographicId);
                    table.ForeignKey(
                        name: "FK_Demographics_Jurisdictions_JurisdictionId",
                        column: x => x.JurisdictionId,
                        principalTable: "Jurisdictions",
                        principalColumn: "JurisdictionId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Demographics_Wards_WardId",
                        column: x => x.WardId,
                        principalTable: "Wards",
                        principalColumn: "WardId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Demographics_JurisdictionId",
                table: "Demographics",
                column: "JurisdictionId");

            migrationBuilder.CreateIndex(
                name: "IX_Demographics_WardId",
                table: "Demographics",
                column: "WardId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Demographics");
        }
    }
}
