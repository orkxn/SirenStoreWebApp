using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SirenStore.Infrastructure.Configurations
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            // Tablo adı ve kolon isimleri artık ApplicationDbContext tarafından
            // otomatik olarak snake_case'e çevriliyor.

            // Kolon kısıtlamaları (iş kuralları)
            builder.Property(p => p.Name).HasMaxLength(60).IsRequired();
            builder.Property(p => p.Brand).HasMaxLength(30).IsRequired();
            builder.Property(p => p.Description).HasMaxLength(150).IsRequired();
            builder.Property(p => p.SellerId).IsRequired();
            builder.Property(p => p.CategoryId).IsRequired();
        }
    }
}