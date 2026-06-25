using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddOrderAndOrderItemEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_order_ıtem_orders_order_ıd",
                table: "order_ıtem");

            migrationBuilder.DropForeignKey(
                name: "fk_order_ıtem_products_product_ıd",
                table: "order_ıtem");

            migrationBuilder.DropForeignKey(
                name: "fk_orders_users_user_ıd",
                table: "orders");

            migrationBuilder.DropPrimaryKey(
                name: "pk_order_ıtem",
                table: "order_ıtem");

            migrationBuilder.DropColumn(
                name: "order_number",
                table: "orders");

            migrationBuilder.DropColumn(
                name: "shipping_address_ıd",
                table: "orders");

            migrationBuilder.DropColumn(
                name: "total_amount",
                table: "orders");

            migrationBuilder.DropColumn(
                name: "unit_price",
                table: "order_ıtem");

            migrationBuilder.RenameTable(
                name: "order_ıtem",
                newName: "order_items");

            migrationBuilder.RenameIndex(
                name: "ıx_order_ıtem_product_ıd",
                table: "order_items",
                newName: "ıx_order_items_product_ıd");

            migrationBuilder.RenameIndex(
                name: "ıx_order_ıtem_order_ıd",
                table: "order_items",
                newName: "ıx_order_items_order_ıd");

            migrationBuilder.AddColumn<string>(
                name: "address_title",
                table: "orders",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "shipping_address",
                table: "orders",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "total_price",
                table: "orders",
                type: "numeric(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "price",
                table: "order_items",
                type: "numeric(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddPrimaryKey(
                name: "pk_order_items",
                table: "order_items",
                column: "ıd");

            migrationBuilder.AddForeignKey(
                name: "fk_order_items_orders_order_ıd",
                table: "order_items",
                column: "order_ıd",
                principalTable: "orders",
                principalColumn: "ıd",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_order_items_products_product_ıd",
                table: "order_items",
                column: "product_ıd",
                principalTable: "products",
                principalColumn: "ıd",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_orders_users_user_ıd",
                table: "orders",
                column: "user_ıd",
                principalTable: "users",
                principalColumn: "ıd",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_order_items_orders_order_ıd",
                table: "order_items");

            migrationBuilder.DropForeignKey(
                name: "fk_order_items_products_product_ıd",
                table: "order_items");

            migrationBuilder.DropForeignKey(
                name: "fk_orders_users_user_ıd",
                table: "orders");

            migrationBuilder.DropPrimaryKey(
                name: "pk_order_items",
                table: "order_items");

            migrationBuilder.DropColumn(
                name: "address_title",
                table: "orders");

            migrationBuilder.DropColumn(
                name: "shipping_address",
                table: "orders");

            migrationBuilder.DropColumn(
                name: "total_price",
                table: "orders");

            migrationBuilder.DropColumn(
                name: "price",
                table: "order_items");

            migrationBuilder.RenameTable(
                name: "order_items",
                newName: "order_ıtem");

            migrationBuilder.RenameIndex(
                name: "ıx_order_items_product_ıd",
                table: "order_ıtem",
                newName: "ıx_order_ıtem_product_ıd");

            migrationBuilder.RenameIndex(
                name: "ıx_order_items_order_ıd",
                table: "order_ıtem",
                newName: "ıx_order_ıtem_order_ıd");

            migrationBuilder.AddColumn<string>(
                name: "order_number",
                table: "orders",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<long>(
                name: "shipping_address_ıd",
                table: "orders",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<decimal>(
                name: "total_amount",
                table: "orders",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "unit_price",
                table: "order_ıtem",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddPrimaryKey(
                name: "pk_order_ıtem",
                table: "order_ıtem",
                column: "ıd");

            migrationBuilder.AddForeignKey(
                name: "fk_order_ıtem_orders_order_ıd",
                table: "order_ıtem",
                column: "order_ıd",
                principalTable: "orders",
                principalColumn: "ıd",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_order_ıtem_products_product_ıd",
                table: "order_ıtem",
                column: "product_ıd",
                principalTable: "products",
                principalColumn: "ıd",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_orders_users_user_ıd",
                table: "orders",
                column: "user_ıd",
                principalTable: "users",
                principalColumn: "ıd",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
