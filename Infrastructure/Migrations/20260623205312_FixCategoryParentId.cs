using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixCategoryParentId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_categories_categories_parent_category_ıd1",
                table: "categories");

            migrationBuilder.DropIndex(
                name: "ıx_categories_parent_category_ıd1",
                table: "categories");

            migrationBuilder.DropColumn(
                name: "parent_category_ıd1",
                table: "categories");

            migrationBuilder.AlterColumn<long>(
                name: "parent_category_ıd",
                table: "categories",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "ıx_categories_parent_category_ıd",
                table: "categories",
                column: "parent_category_ıd");

            migrationBuilder.AddForeignKey(
                name: "fk_categories_categories_parent_category_ıd",
                table: "categories",
                column: "parent_category_ıd",
                principalTable: "categories",
                principalColumn: "ıd");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_categories_categories_parent_category_ıd",
                table: "categories");

            migrationBuilder.DropIndex(
                name: "ıx_categories_parent_category_ıd",
                table: "categories");

            migrationBuilder.AlterColumn<int>(
                name: "parent_category_ıd",
                table: "categories",
                type: "integer",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AddColumn<long>(
                name: "parent_category_ıd1",
                table: "categories",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateIndex(
                name: "ıx_categories_parent_category_ıd1",
                table: "categories",
                column: "parent_category_ıd1");

            migrationBuilder.AddForeignKey(
                name: "fk_categories_categories_parent_category_ıd1",
                table: "categories",
                column: "parent_category_ıd1",
                principalTable: "categories",
                principalColumn: "ıd",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
