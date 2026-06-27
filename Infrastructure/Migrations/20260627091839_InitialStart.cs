using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialStart : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "audit_logs",
                columns: table => new
                {
                    ıd = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_ıd = table.Column<long>(type: "bigint", nullable: true),
                    user_email = table.Column<string>(type: "text", nullable: false),
                    action = table.Column<string>(type: "text", nullable: false),
                    entity_name = table.Column<string>(type: "text", nullable: false),
                    entity_ıd = table.Column<long>(type: "bigint", nullable: true),
                    old_values = table.Column<string>(type: "text", nullable: true),
                    new_values = table.Column<string>(type: "text", nullable: true),
                    ıp_address = table.Column<string>(type: "text", nullable: true),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_audit_logs", x => x.ıd);
                });

            migrationBuilder.CreateTable(
                name: "categories",
                columns: table => new
                {
                    ıd = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    description = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_categories", x => x.ıd);
                });

            migrationBuilder.CreateTable(
                name: "cms_contents",
                columns: table => new
                {
                    ıd = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    title = table.Column<string>(type: "text", nullable: false),
                    slug = table.Column<string>(type: "text", nullable: false),
                    content = table.Column<string>(type: "text", nullable: false),
                    summary = table.Column<string>(type: "text", nullable: true),
                    featured_ımage_url = table.Column<string>(type: "text", nullable: true),
                    content_type = table.Column<int>(type: "integer", nullable: false),
                    ıs_published = table.Column<bool>(type: "boolean", nullable: false),
                    publish_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    sort_order = table.Column<int>(type: "integer", nullable: false),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_cms_contents", x => x.ıd);
                });

            migrationBuilder.CreateTable(
                name: "contact_messages",
                columns: table => new
                {
                    ıd = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    full_name = table.Column<string>(type: "text", nullable: false),
                    email = table.Column<string>(type: "text", nullable: false),
                    phone_number = table.Column<string>(type: "text", nullable: true),
                    subject = table.Column<string>(type: "text", nullable: false),
                    message = table.Column<string>(type: "text", nullable: false),
                    ıs_read = table.Column<bool>(type: "boolean", nullable: false),
                    ıs_replied = table.Column<bool>(type: "boolean", nullable: false),
                    reply_message = table.Column<string>(type: "text", nullable: true),
                    reply_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_contact_messages", x => x.ıd);
                });

            migrationBuilder.CreateTable(
                name: "exception_logs",
                columns: table => new
                {
                    ıd = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    exception_type = table.Column<string>(type: "text", nullable: false),
                    message = table.Column<string>(type: "text", nullable: false),
                    stack_trace = table.Column<string>(type: "text", nullable: true),
                    source = table.Column<string>(type: "text", nullable: true),
                    request_path = table.Column<string>(type: "text", nullable: true),
                    request_method = table.Column<string>(type: "text", nullable: true),
                    query_string = table.Column<string>(type: "text", nullable: true),
                    user_ıd = table.Column<long>(type: "bigint", nullable: true),
                    ıp_address = table.Column<string>(type: "text", nullable: true),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_exception_logs", x => x.ıd);
                });

            migrationBuilder.CreateTable(
                name: "faqs",
                columns: table => new
                {
                    ıd = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    question = table.Column<string>(type: "text", nullable: false),
                    answer = table.Column<string>(type: "text", nullable: false),
                    category = table.Column<string>(type: "text", nullable: true),
                    sort_order = table.Column<int>(type: "integer", nullable: false),
                    ıs_active = table.Column<bool>(type: "boolean", nullable: false),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_faqs", x => x.ıd);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    ıd = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    first_name = table.Column<string>(type: "text", nullable: false),
                    last_name = table.Column<string>(type: "text", nullable: false),
                    email = table.Column<string>(type: "text", nullable: false),
                    password_hash = table.Column<string>(type: "text", nullable: false),
                    phone_number = table.Column<string>(type: "text", nullable: true),
                    user_type = table.Column<int>(type: "integer", nullable: false),
                    ıs_active = table.Column<bool>(type: "boolean", nullable: false),
                    ıs_email_confirmed = table.Column<bool>(type: "boolean", nullable: false),
                    refresh_token = table.Column<string>(type: "text", nullable: true),
                    refresh_token_expiry_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_users", x => x.ıd);
                });

            migrationBuilder.CreateTable(
                name: "vendor_applications",
                columns: table => new
                {
                    ıd = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    company_name = table.Column<string>(type: "text", nullable: false),
                    contact_full_name = table.Column<string>(type: "text", nullable: false),
                    email = table.Column<string>(type: "text", nullable: false),
                    phone_number = table.Column<string>(type: "text", nullable: false),
                    tax_number = table.Column<string>(type: "text", nullable: true),
                    tax_office = table.Column<string>(type: "text", nullable: true),
                    company_address = table.Column<string>(type: "text", nullable: true),
                    website_url = table.Column<string>(type: "text", nullable: true),
                    description = table.Column<string>(type: "text", nullable: true),
                    status = table.Column<int>(type: "integer", nullable: false),
                    rejection_reason = table.Column<string>(type: "text", nullable: true),
                    review_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    reviewed_by_user_ıd = table.Column<long>(type: "bigint", nullable: true),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_vendor_applications", x => x.ıd);
                });

            migrationBuilder.CreateTable(
                name: "address",
                columns: table => new
                {
                    ıd = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    title = table.Column<string>(type: "text", nullable: false),
                    city = table.Column<string>(type: "text", nullable: false),
                    district = table.Column<string>(type: "text", nullable: false),
                    neighborhood = table.Column<string>(type: "text", nullable: false),
                    full_address = table.Column<string>(type: "text", nullable: false),
                    zip_code = table.Column<string>(type: "text", nullable: true),
                    user_ıd = table.Column<long>(type: "bigint", nullable: false),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_address", x => x.ıd);
                    table.ForeignKey(
                        name: "fk_address_users_user_ıd",
                        column: x => x.user_ıd,
                        principalTable: "users",
                        principalColumn: "ıd",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ban_records",
                columns: table => new
                {
                    ıd = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_ıd = table.Column<long>(type: "bigint", nullable: false),
                    reason = table.Column<string>(type: "text", nullable: false),
                    ban_start_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ban_end_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ıs_permanent = table.Column<bool>(type: "boolean", nullable: false),
                    banned_by_user_ıd = table.Column<long>(type: "bigint", nullable: false),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_ban_records", x => x.ıd);
                    table.ForeignKey(
                        name: "fk_ban_records_users_user_ıd",
                        column: x => x.user_ıd,
                        principalTable: "users",
                        principalColumn: "ıd",
                        onDelete: ReferentialAction.Cascade);
                });

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
                name: "login_histories",
                columns: table => new
                {
                    ıd = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_ıd = table.Column<long>(type: "bigint", nullable: false),
                    ıp_address = table.Column<string>(type: "text", nullable: false),
                    user_agent = table.Column<string>(type: "text", nullable: true),
                    ıs_successful = table.Column<bool>(type: "boolean", nullable: false),
                    failure_reason = table.Column<string>(type: "text", nullable: true),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_login_histories", x => x.ıd);
                    table.ForeignKey(
                        name: "fk_login_histories_users_user_ıd",
                        column: x => x.user_ıd,
                        principalTable: "users",
                        principalColumn: "ıd",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "orders",
                columns: table => new
                {
                    ıd = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_ıd = table.Column<long>(type: "bigint", nullable: false),
                    total_price = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    address_title = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    shipping_address = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    status = table.Column<int>(type: "integer", nullable: false),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_orders", x => x.ıd);
                    table.ForeignKey(
                        name: "fk_orders_users_user_ıd",
                        column: x => x.user_ıd,
                        principalTable: "users",
                        principalColumn: "ıd",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "sellers",
                columns: table => new
                {
                    ıd = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    store_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    tax_number = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    tax_office = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    contact_email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    contact_phone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    support_line = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    status = table.Column<int>(type: "integer", nullable: false),
                    user_ıd = table.Column<long>(type: "bigint", nullable: false),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_sellers", x => x.ıd);
                    table.ForeignKey(
                        name: "fk_sellers_users_user_ıd",
                        column: x => x.user_ıd,
                        principalTable: "users",
                        principalColumn: "ıd",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "warning_records",
                columns: table => new
                {
                    ıd = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_ıd = table.Column<long>(type: "bigint", nullable: false),
                    reason = table.Column<string>(type: "text", nullable: false),
                    details = table.Column<string>(type: "text", nullable: true),
                    warned_by_user_ıd = table.Column<long>(type: "bigint", nullable: false),
                    ıs_acknowledged = table.Column<bool>(type: "boolean", nullable: false),
                    acknowledged_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_warning_records", x => x.ıd);
                    table.ForeignKey(
                        name: "fk_warning_records_users_user_ıd",
                        column: x => x.user_ıd,
                        principalTable: "users",
                        principalColumn: "ıd",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "products",
                columns: table => new
                {
                    ıd = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    price = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    stock = table.Column<int>(type: "integer", nullable: false),
                    seller_ıd = table.Column<long>(type: "bigint", nullable: false),
                    category_ıd = table.Column<long>(type: "bigint", nullable: false),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_products", x => x.ıd);
                    table.ForeignKey(
                        name: "fk_products_categories_category_ıd",
                        column: x => x.category_ıd,
                        principalTable: "categories",
                        principalColumn: "ıd",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_products_sellers_seller_ıd",
                        column: x => x.seller_ıd,
                        principalTable: "sellers",
                        principalColumn: "ıd",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "seller_addresses",
                columns: table => new
                {
                    ıd = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    seller_ıd = table.Column<long>(type: "bigint", nullable: false),
                    address_type = table.Column<string>(type: "text", nullable: false),
                    city = table.Column<string>(type: "text", nullable: false),
                    district = table.Column<string>(type: "text", nullable: false),
                    full_address = table.Column<string>(type: "text", nullable: false),
                    zip_code = table.Column<string>(type: "text", nullable: false),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_seller_addresses", x => x.ıd);
                    table.ForeignKey(
                        name: "fk_seller_addresses_sellers_seller_ıd",
                        column: x => x.seller_ıd,
                        principalTable: "sellers",
                        principalColumn: "ıd",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "seller_finances",
                columns: table => new
                {
                    ıd = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    seller_ıd = table.Column<long>(type: "bigint", nullable: false),
                    company_type = table.Column<string>(type: "text", nullable: false),
                    tax_office = table.Column<string>(type: "text", nullable: false),
                    tax_number = table.Column<string>(type: "text", nullable: false),
                    ıban_number = table.Column<string>(type: "text", nullable: false),
                    bank_name = table.Column<string>(type: "text", nullable: false),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_seller_finances", x => x.ıd);
                    table.ForeignKey(
                        name: "fk_seller_finances_sellers_seller_ıd",
                        column: x => x.seller_ıd,
                        principalTable: "sellers",
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
                    product_ıd = table.Column<long>(type: "bigint", nullable: true),
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

            migrationBuilder.CreateTable(
                name: "order_items",
                columns: table => new
                {
                    ıd = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    order_ıd = table.Column<long>(type: "bigint", nullable: false),
                    product_ıd = table.Column<long>(type: "bigint", nullable: true),
                    quantity = table.Column<int>(type: "integer", nullable: false),
                    price = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    status = table.Column<int>(type: "integer", nullable: false),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_order_items", x => x.ıd);
                    table.ForeignKey(
                        name: "fk_order_items_orders_order_ıd",
                        column: x => x.order_ıd,
                        principalTable: "orders",
                        principalColumn: "ıd",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_order_items_products_product_ıd",
                        column: x => x.product_ıd,
                        principalTable: "products",
                        principalColumn: "ıd",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "product_images",
                columns: table => new
                {
                    ıd = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ımage_url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    ıs_main = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    product_ıd = table.Column<long>(type: "bigint", nullable: true),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_product_images", x => x.ıd);
                    table.ForeignKey(
                        name: "fk_product_images_products_product_ıd",
                        column: x => x.product_ıd,
                        principalTable: "products",
                        principalColumn: "ıd",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ıx_address_user_ıd",
                table: "address",
                column: "user_ıd");

            migrationBuilder.CreateIndex(
                name: "ıx_ban_records_user_ıd",
                table: "ban_records",
                column: "user_ıd");

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

            migrationBuilder.CreateIndex(
                name: "ıx_login_histories_user_ıd",
                table: "login_histories",
                column: "user_ıd");

            migrationBuilder.CreateIndex(
                name: "ıx_order_items_order_ıd",
                table: "order_items",
                column: "order_ıd");

            migrationBuilder.CreateIndex(
                name: "ıx_order_items_product_ıd",
                table: "order_items",
                column: "product_ıd");

            migrationBuilder.CreateIndex(
                name: "ıx_orders_user_ıd",
                table: "orders",
                column: "user_ıd");

            migrationBuilder.CreateIndex(
                name: "ıx_product_images_product_ıd",
                table: "product_images",
                column: "product_ıd");

            migrationBuilder.CreateIndex(
                name: "ıx_products_category_ıd",
                table: "products",
                column: "category_ıd");

            migrationBuilder.CreateIndex(
                name: "ıx_products_seller_ıd",
                table: "products",
                column: "seller_ıd");

            migrationBuilder.CreateIndex(
                name: "ıx_seller_addresses_seller_ıd",
                table: "seller_addresses",
                column: "seller_ıd");

            migrationBuilder.CreateIndex(
                name: "ıx_seller_finances_seller_ıd",
                table: "seller_finances",
                column: "seller_ıd");

            migrationBuilder.CreateIndex(
                name: "ıx_sellers_user_ıd",
                table: "sellers",
                column: "user_ıd",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ıx_warning_records_user_ıd",
                table: "warning_records",
                column: "user_ıd");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "address");

            migrationBuilder.DropTable(
                name: "audit_logs");

            migrationBuilder.DropTable(
                name: "ban_records");

            migrationBuilder.DropTable(
                name: "basket_items");

            migrationBuilder.DropTable(
                name: "cms_contents");

            migrationBuilder.DropTable(
                name: "contact_messages");

            migrationBuilder.DropTable(
                name: "exception_logs");

            migrationBuilder.DropTable(
                name: "faqs");

            migrationBuilder.DropTable(
                name: "login_histories");

            migrationBuilder.DropTable(
                name: "order_items");

            migrationBuilder.DropTable(
                name: "product_images");

            migrationBuilder.DropTable(
                name: "seller_addresses");

            migrationBuilder.DropTable(
                name: "seller_finances");

            migrationBuilder.DropTable(
                name: "vendor_applications");

            migrationBuilder.DropTable(
                name: "warning_records");

            migrationBuilder.DropTable(
                name: "baskets");

            migrationBuilder.DropTable(
                name: "orders");

            migrationBuilder.DropTable(
                name: "products");

            migrationBuilder.DropTable(
                name: "categories");

            migrationBuilder.DropTable(
                name: "sellers");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
