using Microsoft.EntityFrameworkCore;
using Entities.Models;
using System.Reflection;
using System.Text.RegularExpressions;

namespace SirenStore.Infrastructure.Context
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // Entities.Models içindeki tüm modelleri DbSet olarak tanımlıyoruz:

        // Kullanıcı & Kimlik
        public DbSet<User> Users { get; set; }
        public DbSet<LoginHistory> LoginHistories { get; set; }

        // Satıcı
        public DbSet<Seller> Sellers { get; set; }
        public DbSet<SellerFinance> SellerFinances { get; set; }
        public DbSet<SellerAddress> SellerAddresses { get; set; }
        public DbSet<VendorApplication> VendorApplications { get; set; }

        // Ürün
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<ProductReview> ProductReviews { get; set; }
        public DbSet<ProductQuestion> ProductQuestions { get; set; }

        // Sipariş ve Sepet
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Basket> Baskets { get; set; }
        public DbSet<BasketItem> BasketItems { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }

        // İçerik & Destek
        public DbSet<CmsContent> CmsContents { get; set; }
        public DbSet<Faq> Faqs { get; set; }
        public DbSet<ContactMessage> ContactMessages { get; set; }

        // Moderasyon
        public DbSet<BanRecord> BanRecords { get; set; }
        public DbSet<WarningRecord> WarningRecords { get; set; }

        // Loglama
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<ExceptionLog> ExceptionLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuration içerisindeki Fluent API ayarlarını otomatik olarak tarar ve veri tabanına uygular
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

            // PostgreSQL için tüm tablo, kolon, key, foreign key ve index isimlerini
            // otomatik olarak snake_case'e çevirir.
            foreach (var entity in modelBuilder.Model.GetEntityTypes())
            {
                // Tablo adını snake_case'e çevir (örn: ProductImage -> product_images)
                var tableName = entity.GetTableName();
                if (tableName != null)
                    entity.SetTableName(ToSnakeCase(tableName));

                // Tüm kolon isimlerini snake_case'e çevir (örn: CreationDate -> creation_date)
                foreach (var property in entity.GetProperties())
                {
                    property.SetColumnName(ToSnakeCase(property.GetColumnName()));
                }

                // Tüm key isimlerini snake_case'e çevir (örn: PK_Products -> pk_products)
                foreach (var key in entity.GetKeys())
                {
                    var keyName = key.GetName();
                    if (keyName != null)
                        key.SetName(ToSnakeCase(keyName));
                }

                // Tüm foreign key isimlerini snake_case'e çevir
                foreach (var fk in entity.GetForeignKeys())
                {
                    var fkName = fk.GetConstraintName();
                    if (fkName != null)
                        fk.SetConstraintName(ToSnakeCase(fkName));
                }

                // Tüm index isimlerini snake_case'e çevir
                foreach (var index in entity.GetIndexes())
                {
                    var indexName = index.GetDatabaseName();
                    if (indexName != null)
                        index.SetDatabaseName(ToSnakeCase(indexName));
                }
            }
        }

        /// <summary>
        /// PascalCase veya camelCase string'i PostgreSQL uyumlu snake_case'e çevirir.
        /// </summary>
        private static string ToSnakeCase(string input)
        {
            if (string.IsNullOrEmpty(input))
                return input;

            // Büyük harflerden önce alt çizgi ekle, ardından küçük harfe çevir
            var snakeCase = Regex.Replace(input, "([a-z0-9])([A-Z])", "$1_$2");
            snakeCase = Regex.Replace(snakeCase, "([A-Z]+)([A-Z][a-z])", "$1_$2");
            return snakeCase.ToLower();
        }
    }
}