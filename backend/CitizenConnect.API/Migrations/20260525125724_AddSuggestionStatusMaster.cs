using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CitizenConnect.API.Migrations
{
    /// <inheritdoc />
    public partial class AddSuggestionStatusMaster : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Status",
                table: "Suggestions",
                newName: "SuggestionStatusMasterId");

            migrationBuilder.AlterColumn<string>(
                name: "OldStatus",
                table: "SuggestionStatusHistories",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "NewStatus",
                table: "SuggestionStatusHistories",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateTable(
                name: "SuggestionStatusMasters",
                columns: table => new
                {
                    SuggestionStatusMasterId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StatusName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SuggestionStatusMasters", x => x.SuggestionStatusMasterId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Suggestions_SuggestionStatusMasterId",
                table: "Suggestions",
                column: "SuggestionStatusMasterId");

            migrationBuilder.CreateIndex(
                name: "IX_SuggestionStatusMasters_StatusName",
                table: "SuggestionStatusMasters",
                column: "StatusName",
                unique: true);

            migrationBuilder.Sql(@"
INSERT INTO SuggestionStatusMasters
(
    StatusName,
    Description,
    DisplayOrder,
    CreatedAt,
    IsActive
)
VALUES
('Pending', 'Waiting for review', 1, GETDATE(), 1),

('Under Review', 'Suggestion under review', 2, GETDATE(), 1),

('Approved', 'Suggestion approved', 3, GETDATE(), 1),

('Rejected', 'Suggestion rejected', 4, GETDATE(), 1),

('Implemented', 'Suggestion implemented', 5, GETDATE(), 1)
");

            migrationBuilder.AddForeignKey(
                name: "FK_Suggestions_SuggestionStatusMasters_SuggestionStatusMasterId",
                table: "Suggestions",
                column: "SuggestionStatusMasterId",
                principalTable: "SuggestionStatusMasters",
                principalColumn: "SuggestionStatusMasterId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Suggestions_SuggestionStatusMasters_SuggestionStatusMasterId",
                table: "Suggestions");

            migrationBuilder.DropTable(
                name: "SuggestionStatusMasters");

            migrationBuilder.DropIndex(
                name: "IX_Suggestions_SuggestionStatusMasterId",
                table: "Suggestions");

            migrationBuilder.RenameColumn(
                name: "SuggestionStatusMasterId",
                table: "Suggestions",
                newName: "Status");

            migrationBuilder.AlterColumn<int>(
                name: "OldStatus",
                table: "SuggestionStatusHistories",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<int>(
                name: "NewStatus",
                table: "SuggestionStatusHistories",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }
    }
}
