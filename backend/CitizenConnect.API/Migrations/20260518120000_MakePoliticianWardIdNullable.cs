using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CitizenConnect.API.Migrations
{
    /// <summary>
    /// Makes WardId nullable on the Politicians table.
    /// The ward dropdown was removed from the politician registration form;
    /// politicians now identify their ward via WardNumber and WardName text fields.
    /// </summary>
    public partial class MakePoliticianWardIdNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop the existing NOT NULL foreign key index and constraint
            migrationBuilder.DropForeignKey(
                name: "FK_Politicians_Wards_WardId",
                table: "Politicians");

            migrationBuilder.DropIndex(
                name: "IX_Politicians_WardId",
                table: "Politicians");

            // Alter WardId to allow NULL
            migrationBuilder.AlterColumn<int>(
                name: "WardId",
                table: "Politicians",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            // Re-create the index allowing NULLs
            migrationBuilder.CreateIndex(
                name: "IX_Politicians_WardId",
                table: "Politicians",
                column: "WardId");

            // Re-add the foreign key as optional
            migrationBuilder.AddForeignKey(
                name: "FK_Politicians_Wards_WardId",
                table: "Politicians",
                column: "WardId",
                principalTable: "Wards",
                principalColumn: "WardId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Politicians_Wards_WardId",
                table: "Politicians");

            migrationBuilder.DropIndex(
                name: "IX_Politicians_WardId",
                table: "Politicians");

            // Revert WardId to NOT NULL (set any NULLs to 0 first to avoid constraint violation)
            migrationBuilder.Sql(
                "UPDATE Politicians SET WardId = 0 WHERE WardId IS NULL");

            migrationBuilder.AlterColumn<int>(
                name: "WardId",
                table: "Politicians",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldNullable: true,
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_Politicians_WardId",
                table: "Politicians",
                column: "WardId");

            migrationBuilder.AddForeignKey(
                name: "FK_Politicians_Wards_WardId",
                table: "Politicians",
                column: "WardId",
                principalTable: "Wards",
                principalColumn: "WardId");
        }
    }
}
