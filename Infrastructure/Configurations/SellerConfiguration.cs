using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SirenStore.Infrastructure.Configurations
{
    public class SellerConfiguration : IEntityTypeConfiguration<Seller>
    {
        public void Configure(EntityTypeBuilder<Seller> builder)
        {
            // Tablo adı ve kolon isimleri artık ApplicationDbContext tarafından
            // otomatik olarak snake_case'e çevriliyor.

            // Kolon kısıtlamaları (iş kuralları)
            builder.Property(s => s.StoreName).HasMaxLength(150).IsRequired();
            builder.Property(s => s.ContactEmail).HasMaxLength(100).IsRequired();
            builder.Property(s => s.ContactPhone).HasMaxLength(20).IsRequired();
            builder.Property(s => s.SupportLine).HasMaxLength(30).IsRequired();
        }
    }
}