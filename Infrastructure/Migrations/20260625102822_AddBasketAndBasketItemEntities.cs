using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBasketAndBasketItemEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_order_ıtems_orders_order_ıd",
                table: "order_ıtems");

            migrationBuilder.DropForeignKey(
                name: "fk_order_ıtems_products_product_ıd",
                table: "order_ıtems");

            migrationBuilder.DropPrimaryKey(
                name: "pk_order_ıtems",
                table: "order_ıtems");

            migrationBuilder.RenameTable(
                name: "order_ıtems",
                newName: "order_ıtem");

            migrationBuilder.RenameIndex(
                name: "ıx_order_ıtems_product_ıd",
                table: "order_ıtem",
                newName: "ıx_order_ıtem_product_ıd");

            migrationBuilder.RenameIndex(
                name: "ıx_order_ıtems_order_ıd",
                table: "order_ıtem",
                newName: "ıx_order_ıtem_order_ıd");

            migrationBuilder.AddPrimaryKey(
                name: "pk_order_ıtem",
                table: "order_ıtem",
                column: "ıd");

            migrationBuilder.CreateTable(
                name: "baskets",
                columns: table => new
                {
                    ıd = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_ıd = table.Column<long>(type: "bigint", nullable: false),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_baskets", x => x.ıd);
                    table.ForeignKey(
                        name: "fk_baskets_users_user_ıd",
                        column: x => x.user_ıd,
                        principalTable: "users",
                        principalColumn: "ıd",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "basket_items",
                columns: table => new
                {
                    ıd = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    basket_ıd = table.Column<long>(type: "bigint", nullable: false),
                    product_ıd = table.Column<long>(type: "bigint", nullable: false),
                    quantity = table.Column<int>(type: "integer", nullable: false, defaultValue: 1),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_basket_items", x => x.ıd);
                    table.ForeignKey(
                        name: "fk_basket_items_baskets_basket_ıd",
                        column: x => x.basket_ıd,
                        principalTable: "baskets",
                        principalColumn: "ıd",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_basket_items_products_product_ıd",
                        column: x => x.product_ıd,
                        principalTable: "products",
                        principalColumn: "ıd",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ıx_basket_items_basket_ıd",
                table: "basket_items",
                column: "basket_ıd");

            migrationBuilder.CreateIndex(
                name: "ıx_basket_items_product_ıd",
                table: "basket_items",
                column: "product_ıd");

            migrationBuilder.CreateIndex(
                name: "ıx_baskets_user_ıd",
                table: "baskets",
                column: "user_ıd",
                unique: true);

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_order_ıtem_orders_order_ıd",
                table: "order_ıtem");

            migrationBuilder.DropForeignKey(
                name: "fk_order_ıtem_products_product_ıd",
                table: "order_ıtem");

            migrationBuilder.DropTable(
                name: "basket_items");

            migrationBuilder.DropTable(
                name: "baskets");

            migrationBuilder.DropPrimaryKey(
                name: "pk_order_ıtem",
                table: "order_ıtem");

            migrationBuilder.RenameTable(
                name: "order_ıtem",
                newName: "order_ıtems");

            migrationBuilder.RenameIndex(
                name: "ıx_order_ıtem_product_ıd",
                table: "order_ıtems",
                newName: "ıx_order_ıtems_product_ıd");

            migrationBuilder.RenameIndex(
                name: "ıx_order_ıtem_order_ıd",
                table: "order_ıtems",
                newName: "ıx_order_ıtems_order_ıd");

            migrationBuilder.AddPrimaryKey(
                name: "pk_order_ıtems",
                table: "order_ıtems",
                column: "ıd");

            migrationBuilder.AddForeignKey(
                name: "fk_order_ıtems_orders_order_ıd",
                table: "order_ıtems",
                column: "order_ıd",
                principalTable: "orders",
                principalColumn: "ıd",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_order_ıtems_products_product_ıd",
                table: "order_ıtems",
                column: "product_ıd",
                principalTable: "products",
                principalColumn: "ıd",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
