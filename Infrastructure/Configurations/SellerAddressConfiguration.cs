using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SirenStore.Infrastructure.Configurations
{
    public class SellerAddressConfiguration : IEntityTypeConfiguration<SellerAddress>
    {
        public void Configure(EntityTypeBuilder<SellerAddress> builder)
        {
            // Tablo adı ve kolon isimleri artık ApplicationDbContext tarafından
            // otomatik olarak snake_case'e çevriliyor.

            // Kolon kısıtlamaları (iş kuralları)
            builder.Property(sa => sa.FullAddress).IsRequired();

            // Bire-Çok (One-to-Many) İlişki Tanımı:
            // Her adres bir satıcıya bağlanır, bir satıcının birden fazla adresi olabilir.
            builder.HasOne(sa => sa.Seller)
                   .WithMany(s => s.Addresses)
                   .HasForeignKey(sa => sa.SellerId); // Foreign Key belirtildi
        }
    }
}