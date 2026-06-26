using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FinalCleanup2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_sellers_users_user_ıd1",
                table: "sellers");

            migrationBuilder.DropIndex(
                name: "ıx_sellers_user_ıd1",
                table: "sellers");

            migrationBuilder.DropColumn(
                name: "user_ıd1",
                table: "sellers");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "user_ıd1",
                table: "sellers",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ıx_sellers_user_ıd1",
                table: "sellers",
                column: "user_ıd1",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "fk_sellers_users_user_ıd1",
                table: "sellers",
                column: "user_ıd1",
                principalTable: "users",
                principalColumn: "ıd");
        }
    }
}
