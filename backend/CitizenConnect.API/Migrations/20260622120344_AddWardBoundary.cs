using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CitizenConnect.API.Migrations
{
    /// <inheritdoc />
    public partial class AddWardBoundary : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            

           

            migrationBuilder.CreateTable(
                name: "WardBoundaries",
                columns: table => new
                {
                    WardBoundaryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WardId = table.Column<int>(type: "int", nullable: false),
                    GeoJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WardBoundaries", x => x.WardBoundaryId);
                    table.ForeignKey(
                        name: "FK_WardBoundaries_Wards_WardId",
                        column: x => x.WardId,
                        principalTable: "Wards",
                        principalColumn: "WardId",
                        onDelete: ReferentialAction.Cascade);
                });

            

            migrationBuilder.CreateIndex(
                name: "IX_WardBoundaries_WardId",
                table: "WardBoundaries",
                column: "WardId");

           
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
           

            migrationBuilder.DropTable(
                name: "WardBoundaries");

            

           

            
        }
    }
}
