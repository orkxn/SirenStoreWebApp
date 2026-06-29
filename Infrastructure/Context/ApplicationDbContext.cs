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

        // Entities.Models içindeki tüm modeller dbset olarak eklendi

        // kullancı ve kimlik
        public DbSet<User> Users { get; set; }
        public DbSet<LoginHistory> LoginHistories { get; set; }

        // satıcı
        public DbSet<Seller> Sellers { get; set; }
        public DbSet<SellerFinance> SellerFinances { get; set; }
        public DbSet<SellerAddress> SellerAddresses { get; set; }
        public DbSet<VendorApplication> VendorApplications { get; set; }

        // ürün
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }

        // sipariş ve sepet
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Basket> Baskets { get; set; }
        public DbSet<BasketItem> BasketItems { get; set; }

        // içerik ve destek
        public DbSet<CmsContent> CmsContents { get; set; }
        public DbSet<Faq> Faqs { get; set; }
        public DbSet<ContactMessage> ContactMessages { get; set; }

        // moderasyon
        public DbSet<BanRecord> BanRecords { get; set; }
        public DbSet<WarningRecord> WarningRecords { get; set; }

        // loglama
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<ExceptionLog> ExceptionLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // configurationdaki tüm entity configurationları otomatik olarak uygular
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

            // postgre için snake_case dönüşümünü uygular
            foreach (var entity in modelBuilder.Model.GetEntityTypes())
            {
                var tableName = entity.GetTableName();
                if (tableName != null)
                    entity.SetTableName(ToSnakeCase(tableName));

                foreach (var property in entity.GetProperties())
                {
                    property.SetColumnName(ToSnakeCase(property.GetColumnName()));
                }

                foreach (var key in entity.GetKeys())
                {
                    var keyName = key.GetName();
                    if (keyName != null)
                        key.SetName(ToSnakeCase(keyName));
                }

                foreach (var fk in entity.GetForeignKeys())
                {
                    var fkName = fk.GetConstraintName();
                    if (fkName != null)
                        fk.SetConstraintName(ToSnakeCase(fkName));
                }

                foreach (var index in entity.GetIndexes())
                {
                    var indexName = index.GetDatabaseName();
                    if (indexName != null)
                        index.SetDatabaseName(ToSnakeCase(indexName));
                }
            }
        }

        /// <summary>
        /// pascalcase veya camelcase stringi snake_case stringe çevirir
        /// </summary>
        private static string ToSnakeCase(string input)
        {
            if (string.IsNullOrEmpty(input))
                return input;

            var snakeCase = Regex.Replace(input, "([a-z0-9])([A-Z])", "$1_$2");
            snakeCase = Regex.Replace(snakeCase, "([A-Z]+)([A-Z][a-z])", "$1_$2");
            return snakeCase.ToLower();
        }
    }
}