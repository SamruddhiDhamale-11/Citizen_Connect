using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CitizenConnect.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePoliticianRegistrationFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Gender",
                table: "Politicians",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "IdProofPath",
                table: "Politicians",
                type: "nvarchar(max)",
                nullable: true);

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Gender",
                table: "Politicians");

            migrationBuilder.DropColumn(
                name: "IdProofPath",
                table: "Politicians");

            migrationBuilder.DropColumn(
                name: "PartName",
                table: "Politicians");

            migrationBuilder.DropColumn(
                name: "WardName",
                table: "Politicians");

            migrationBuilder.DropColumn(
                name: "WardNumber",
                table: "Politicians");
        }
    }
}
