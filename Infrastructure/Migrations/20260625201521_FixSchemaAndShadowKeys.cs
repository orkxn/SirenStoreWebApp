using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixSchemaAndShadowKeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "cart_ıtems");

            migrationBuilder.DropTable(
                name: "product_questions");

            migrationBuilder.DropTable(
                name: "product_reviews");

            migrationBuilder.DropTable(
                name: "carts");

            migrationBuilder.AlterColumn<long>(
                name: "product_ıd",
                table: "product_images",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<long>(
                name: "product_ıd",
                table: "order_items",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<long>(
                name: "product_ıd",
                table: "basket_items",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<long>(
                name: "product_ıd",
                table: "product_images",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AlterColumn<long>(
                name: "product_ıd",
                table: "order_items",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AlterColumn<long>(
                name: "product_ıd",
                table: "basket_items",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "carts",
                columns: table => new
                {
                    ıd = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_ıd = table.Column<long>(type: "bigint", nullable: false),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false),
                    total_amount = table.Column<decimal>(type: "numeric", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_carts", x => x.ıd);
                    table.ForeignKey(
                        name: "fk_carts_users_user_ıd",
                        column: x => x.user_ıd,
                        principalTable: "users",
                        principalColumn: "ıd",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "product_questions",
                columns: table => new
                {
                    ıd = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    product_ıd = table.Column<long>(type: "bigint", nullable: false),
                    answer_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    answer_text = table.Column<string>(type: "text", nullable: false),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false),
                    question_text = table.Column<string>(type: "text", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    user_email = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_product_questions", x => x.ıd);
                    table.ForeignKey(
                        name: "fk_product_questions_products_product_ıd",
                        column: x => x.product_ıd,
                        principalTable: "products",
                        principalColumn: "ıd",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "product_reviews",
                columns: table => new
                {
                    ıd = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    product_ıd = table.Column<long>(type: "bigint", nullable: false),
                    comment = table.Column<string>(type: "text", nullable: false),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false),
                    rating = table.Column<int>(type: "integer", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    user_email = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_product_reviews", x => x.ıd);
                    table.ForeignKey(
                        name: "fk_product_reviews_products_product_ıd",
                        column: x => x.product_ıd,
                        principalTable: "products",
                        principalColumn: "ıd",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "cart_ıtems",
                columns: table => new
                {
                    ıd = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    cart_ıd = table.Column<long>(type: "bigint", nullable: false),
                    product_ıd = table.Column<long>(type: "bigint", nullable: false),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false),
                    quantity = table.Column<int>(type: "integer", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_cart_ıtems", x => x.ıd);
                    table.ForeignKey(
                        name: "fk_cart_ıtems_carts_cart_ıd",
                        column: x => x.cart_ıd,
                        principalTable: "carts",
                        principalColumn: "ıd",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_cart_ıtems_products_product_ıd",
                        column: x => x.product_ıd,
                        principalTable: "products",
                        principalColumn: "ıd",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ıx_cart_ıtems_cart_ıd",
                table: "cart_ıtems",
                column: "cart_ıd");

            migrationBuilder.CreateIndex(
                name: "ıx_cart_ıtems_product_ıd",
                table: "cart_ıtems",
                column: "product_ıd");

            migrationBuilder.CreateIndex(
                name: "ıx_carts_user_ıd",
                table: "carts",
                column: "user_ıd");

            migrationBuilder.CreateIndex(
                name: "ıx_product_questions_product_ıd",
                table: "product_questions",
                column: "product_ıd");

            migrationBuilder.CreateIndex(
                name: "ıx_product_reviews_product_ıd",
                table: "product_reviews",
                column: "product_ıd");
        }
    }
}
