using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProductCategoryAndImageEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_categories_categories_parent_category_ıd",
                table: "categories");

            migrationBuilder.DropForeignKey(
                name: "fk_product_ımages_products_product_ıd",
                table: "product_ımages");

            migrationBuilder.DropForeignKey(
                name: "fk_products_categories_category_ıd",
                table: "products");

            migrationBuilder.DropIndex(
                name: "ıx_categories_parent_category_ıd",
                table: "categories");

            migrationBuilder.DropPrimaryKey(
                name: "pk_product_ımages",
                table: "product_ımages");

            migrationBuilder.DropColumn(
                name: "brand",
                table: "products");

            migrationBuilder.DropColumn(
                name: "ıs_active",
                table: "products");

            migrationBuilder.DropColumn(
                name: "parent_category_ıd",
                table: "categories");

            migrationBuilder.DropColumn(
                name: "url",
                table: "product_ımages");

            migrationBuilder.RenameTable(
                name: "product_ımages",
                newName: "product_images");

            migrationBuilder.RenameIndex(
                name: "ıx_product_ımages_product_ıd",
                table: "product_images",
                newName: "ıx_product_images_product_ıd");

            migrationBuilder.AlterColumn<decimal>(
                name: "price",
                table: "products",
                type: "numeric(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric");

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "products",
                type: "character varying(150)",
                maxLength: 150,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(60)",
                oldMaxLength: 60);

            migrationBuilder.AlterColumn<string>(
                name: "description",
                table: "products",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(150)",
                oldMaxLength: 150);

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "categories",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "description",
                table: "categories",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<bool>(
                name: "ıs_main",
                table: "product_images",
                type: "boolean",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "boolean");

            migrationBuilder.AddColumn<string>(
                name: "ımage_url",
                table: "product_images",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "pk_product_images",
                table: "product_images",
                column: "ıd");

            migrationBuilder.AddForeignKey(
                name: "fk_product_images_products_product_ıd",
                table: "product_images",
                column: "product_ıd",
                principalTable: "products",
                principalColumn: "ıd",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_products_categories_category_ıd",
                table: "products",
                column: "category_ıd",
                principalTable: "categories",
                principalColumn: "ıd",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_product_images_products_product_ıd",
                table: "product_images");

            migrationBuilder.DropForeignKey(
                name: "fk_products_categories_category_ıd",
                table: "products");

            migrationBuilder.DropPrimaryKey(
                name: "pk_product_images",
                table: "product_images");

            migrationBuilder.DropColumn(
                name: "ımage_url",
                table: "product_images");

            migrationBuilder.RenameTable(
                name: "product_images",
                newName: "product_ımages");

            migrationBuilder.RenameIndex(
                name: "ıx_product_images_product_ıd",
                table: "product_ımages",
                newName: "ıx_product_ımages_product_ıd");

            migrationBuilder.AlterColumn<decimal>(
                name: "price",
                table: "products",
                type: "numeric",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,2)");

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "products",
                type: "character varying(60)",
                maxLength: 60,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(150)",
                oldMaxLength: 150);

            migrationBuilder.AlterColumn<string>(
                name: "description",
                table: "products",
                type: "character varying(150)",
                maxLength: 150,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(1000)",
                oldMaxLength: 1000);

            migrationBuilder.AddColumn<string>(
                name: "brand",
                table: "products",
                type: "character varying(30)",
                maxLength: 30,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "ıs_active",
                table: "products",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "categories",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "description",
                table: "categories",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200);

            migrationBuilder.AddColumn<long>(
                name: "parent_category_ıd",
                table: "categories",
                type: "bigint",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "ıs_main",
                table: "product_ımages",
                type: "boolean",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "boolean",
                oldDefaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "url",
                table: "product_ımages",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "pk_product_ımages",
                table: "product_ımages",
                column: "ıd");

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

            migrationBuilder.AddForeignKey(
                name: "fk_product_ımages_products_product_ıd",
                table: "product_ımages",
                column: "product_ıd",
                principalTable: "products",
                principalColumn: "ıd",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_products_categories_category_ıd",
                table: "products",
                column: "category_ıd",
                principalTable: "categories",
                principalColumn: "ıd",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
