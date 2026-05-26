using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CitizenConnect.API.Migrations
{
    /// <inheritdoc />
    public partial class FinalStatusMasterConversion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Status",
                table: "Complaints",
                newName: "ComplaintStatusMasterId");

            migrationBuilder.AlterColumn<string>(
                name: "OldStatus",
                table: "ComplaintStatusHistories",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "NewStatus",
                table: "ComplaintStatusHistories",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateTable(
                name: "ComplaintStatusMasters",
                columns: table => new
                {
                    ComplaintStatusMasterId = table.Column<int>(type: "int", nullable: false)
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
                    table.PrimaryKey("PK_ComplaintStatusMasters", x => x.ComplaintStatusMasterId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Complaints_ComplaintStatusMasterId",
                table: "Complaints",
                column: "ComplaintStatusMasterId");

            migrationBuilder.CreateIndex(
                name: "IX_ComplaintStatusMasters_StatusName",
                table: "ComplaintStatusMasters",
                column: "StatusName",
                unique: true);

            migrationBuilder.Sql(@"
INSERT INTO ComplaintStatusMasters
(
    StatusName,
    Description,
    DisplayOrder,
    CreatedAt,
    IsActive
)
VALUES
('Pending', 'Waiting for assignment', 1, GETDATE(), 1),

('Assigned', 'Complaint assigned', 2, GETDATE(), 1),

('In Progress', 'Work in progress', 3, GETDATE(), 1),

('Resolved', 'Complaint resolved', 4, GETDATE(), 1),

('Rejected', 'Complaint rejected', 5, GETDATE(), 1)
");

            migrationBuilder.AddForeignKey(
                name: "FK_Complaints_ComplaintStatusMasters_ComplaintStatusMasterId",
                table: "Complaints",
                column: "ComplaintStatusMasterId",
                principalTable: "ComplaintStatusMasters",
                principalColumn: "ComplaintStatusMasterId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Complaints_ComplaintStatusMasters_ComplaintStatusMasterId",
                table: "Complaints");

            migrationBuilder.DropTable(
                name: "ComplaintStatusMasters");

            migrationBuilder.DropIndex(
                name: "IX_Complaints_ComplaintStatusMasterId",
                table: "Complaints");

            migrationBuilder.RenameColumn(
                name: "ComplaintStatusMasterId",
                table: "Complaints",
                newName: "Status");

            migrationBuilder.AlterColumn<int>(
                name: "OldStatus",
                table: "ComplaintStatusHistories",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<int>(
                name: "NewStatus",
                table: "ComplaintStatusHistories",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }
    }
}
