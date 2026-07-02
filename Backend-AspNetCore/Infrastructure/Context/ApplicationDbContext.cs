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

        // ürün
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }

        // sipariş ve sepet
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Basket> Baskets { get; set; }
        public DbSet<BasketItem> BasketItems { get; set; }
        public DbSet<Favorite> Favorites { get; set; }

        // içerik ve destek
        public DbSet<ContactMessage> ContactMessages { get; set; }
        public DbSet<Comment> Comments { get; set; }

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
                if (entity.GetTableName() is { } t) entity.SetTableName(ToSnakeCase(t));
                foreach (var prop in entity.GetProperties()) prop.SetColumnName(ToSnakeCase(prop.GetColumnName()));
                foreach (var key in entity.GetKeys()) if (key.GetName() is { } k) key.SetName(ToSnakeCase(k));
                foreach (var fk in entity.GetForeignKeys()) if (fk.GetConstraintName() is { } f) fk.SetConstraintName(ToSnakeCase(f));
                foreach (var idx in entity.GetIndexes()) if (idx.GetDatabaseName() is { } i) idx.SetDatabaseName(ToSnakeCase(i));
            }
        }

        public override int SaveChanges()
        {
            SetBaseModelProperties();
            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            SetBaseModelProperties();
            return await base.SaveChangesAsync(cancellationToken);
        }

        private void SetBaseModelProperties()
        {
            var entries = ChangeTracker.Entries<BaseModel>();
            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Added)
                {
                    if (entry.Entity.CreationDate == default)
                    {
                        entry.Entity.CreationDate = DateTime.UtcNow;
                    }
                }
                else if (entry.State == EntityState.Modified)
                {
                    entry.Entity.UpdatedDate = DateTime.UtcNow;
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
            return snakeCase.ToLowerInvariant();
        }
    }
}