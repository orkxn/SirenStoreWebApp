using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
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
                    name = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    parent_category_ıd = table.Column<long>(type: "bigint", nullable: true),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_categories", x => x.ıd);
                    table.ForeignKey(
                        name: "fk_categories_categories_parent_category_ıd",
                        column: x => x.parent_category_ıd,
                        principalTable: "categories",
                        principalColumn: "ıd");
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
                name: "sellers",
                columns: table => new
                {
                    ıd = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    store_name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    contact_email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    contact_phone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    support_line = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    ıs_approved = table.Column<bool>(type: "boolean", nullable: false),
                    ıs_active = table.Column<bool>(type: "boolean", nullable: false),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_sellers", x => x.ıd);
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
                name: "products",
                columns: table => new
                {
                    ıd = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                    brand = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    description = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    ıs_active = table.Column<bool>(type: "boolean", nullable: false),
                    price = table.Column<decimal>(type: "numeric", nullable: false),
                    stock = table.Column<int>(type: "integer", nullable: false),
                    category_ıd = table.Column<long>(type: "bigint", nullable: false),
                    seller_ıd = table.Column<long>(type: "bigint", nullable: false),
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
                        onDelete: ReferentialAction.Cascade);
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
                    ıban_number = table.Column<string>(type: "character varying(34)", maxLength: 34, nullable: false),
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
                    seller_ıd = table.Column<long>(type: "bigint", nullable: true),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_users", x => x.ıd);
                    table.ForeignKey(
                        name: "fk_users_sellers_seller_ıd",
                        column: x => x.seller_ıd,
                        principalTable: "sellers",
                        principalColumn: "ıd");
                });

            migrationBuilder.CreateTable(
                name: "product_ımages",
                columns: table => new
                {
                    ıd = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    product_ıd = table.Column<long>(type: "bigint", nullable: false),
                    url = table.Column<string>(type: "text", nullable: false),
                    ıs_main = table.Column<bool>(type: "boolean", nullable: false),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_product_ımages", x => x.ıd);
                    table.ForeignKey(
                        name: "fk_product_ımages_products_product_ıd",
                        column: x => x.product_ıd,
                        principalTable: "products",
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
                    user_email = table.Column<string>(type: "text", nullable: false),
                    question_text = table.Column<string>(type: "text", nullable: false),
                    answer_text = table.Column<string>(type: "text", nullable: false),
                    answer_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false)
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
                    user_email = table.Column<string>(type: "text", nullable: false),
                    comment = table.Column<string>(type: "text", nullable: false),
                    rating = table.Column<int>(type: "integer", nullable: false),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false)
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
                name: "carts",
                columns: table => new
                {
                    ıd = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_ıd = table.Column<long>(type: "bigint", nullable: false),
                    total_amount = table.Column<decimal>(type: "numeric", nullable: false),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false)
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
                    order_number = table.Column<string>(type: "text", nullable: false),
                    total_amount = table.Column<decimal>(type: "numeric", nullable: false),
                    status = table.Column<int>(type: "integer", nullable: false),
                    shipping_address_ıd = table.Column<long>(type: "bigint", nullable: false),
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
                name: "cart_ıtems",
                columns: table => new
                {
                    ıd = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    cart_ıd = table.Column<long>(type: "bigint", nullable: false),
                    product_ıd = table.Column<long>(type: "bigint", nullable: false),
                    quantity = table.Column<int>(type: "integer", nullable: false),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false)
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

            migrationBuilder.CreateTable(
                name: "order_ıtems",
                columns: table => new
                {
                    ıd = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    order_ıd = table.Column<long>(type: "bigint", nullable: false),
                    product_ıd = table.Column<long>(type: "bigint", nullable: false),
                    quantity = table.Column<int>(type: "integer", nullable: false),
                    unit_price = table.Column<decimal>(type: "numeric", nullable: false),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ıs_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_order_ıtems", x => x.ıd);
                    table.ForeignKey(
                        name: "fk_order_ıtems_orders_order_ıd",
                        column: x => x.order_ıd,
                        principalTable: "orders",
                        principalColumn: "ıd",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_order_ıtems_products_product_ıd",
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
                name: "ıx_categories_parent_category_ıd",
                table: "categories",
                column: "parent_category_ıd");

            migrationBuilder.CreateIndex(
                name: "ıx_login_histories_user_ıd",
                table: "login_histories",
                column: "user_ıd");

            migrationBuilder.CreateIndex(
                name: "ıx_order_ıtems_order_ıd",
                table: "order_ıtems",
                column: "order_ıd");

            migrationBuilder.CreateIndex(
                name: "ıx_order_ıtems_product_ıd",
                table: "order_ıtems",
                column: "product_ıd");

            migrationBuilder.CreateIndex(
                name: "ıx_orders_user_ıd",
                table: "orders",
                column: "user_ıd");

            migrationBuilder.CreateIndex(
                name: "ıx_product_ımages_product_ıd",
                table: "product_ımages",
                column: "product_ıd");

            migrationBuilder.CreateIndex(
                name: "ıx_product_questions_product_ıd",
                table: "product_questions",
                column: "product_ıd");

            migrationBuilder.CreateIndex(
                name: "ıx_product_reviews_product_ıd",
                table: "product_reviews",
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
                column: "seller_ıd",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ıx_users_seller_ıd",
                table: "users",
                column: "seller_ıd");

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
                name: "cart_ıtems");

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
                name: "order_ıtems");

            migrationBuilder.DropTable(
                name: "product_ımages");

            migrationBuilder.DropTable(
                name: "product_questions");

            migrationBuilder.DropTable(
                name: "product_reviews");

            migrationBuilder.DropTable(
                name: "seller_addresses");

            migrationBuilder.DropTable(
                name: "seller_finances");

            migrationBuilder.DropTable(
                name: "vendor_applications");

            migrationBuilder.DropTable(
                name: "warning_records");

            migrationBuilder.DropTable(
                name: "carts");

            migrationBuilder.DropTable(
                name: "orders");

            migrationBuilder.DropTable(
                name: "products");

            migrationBuilder.DropTable(
                name: "users");

            migrationBuilder.DropTable(
                name: "categories");

            migrationBuilder.DropTable(
                name: "sellers");
        }
    }
}
