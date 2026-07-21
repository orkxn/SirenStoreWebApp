using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAllPerformanceIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_products_category_id",
                table: "products");

            migrationBuilder.CreateIndex(
                name: "ix_sellers_store_name",
                table: "sellers",
                column: "store_name");

            migrationBuilder.CreateIndex(
                name: "ix_sellers_tax_number",
                table: "sellers",
                column: "tax_number");

            migrationBuilder.CreateIndex(
                name: "ix_products_category_id_price",
                table: "products",
                columns: new[] { "category_id", "price" });

            migrationBuilder.CreateIndex(
                name: "ix_products_price",
                table: "products",
                column: "price");

            migrationBuilder.CreateIndex(
                name: "ix_login_histories_creation_date",
                table: "login_histories",
                column: "creation_date");

            migrationBuilder.CreateIndex(
                name: "ix_audit_logs_creation_date",
                table: "audit_logs",
                column: "creation_date");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_sellers_store_name",
                table: "sellers");

            migrationBuilder.DropIndex(
                name: "ix_sellers_tax_number",
                table: "sellers");

            migrationBuilder.DropIndex(
                name: "ix_products_category_id_price",
                table: "products");

            migrationBuilder.DropIndex(
                name: "ix_products_price",
                table: "products");

            migrationBuilder.DropIndex(
                name: "ix_login_histories_creation_date",
                table: "login_histories");

            migrationBuilder.DropIndex(
                name: "ix_audit_logs_creation_date",
                table: "audit_logs");

            migrationBuilder.CreateIndex(
                name: "ix_products_category_id",
                table: "products",
                column: "category_id");
        }
    }
}
