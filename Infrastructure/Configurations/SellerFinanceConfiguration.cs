using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SirenStore.Infrastructure.Configurations
{
    public class SellerFinanceConfiguration : IEntityTypeConfiguration<SellerFinance>
    {
        public void Configure(EntityTypeBuilder<SellerFinance> builder)
        {
            // Tablo adı ve kolon isimleri artık ApplicationDbContext tarafından
            // otomatik olarak snake_case'e çevriliyor.

            // Kolon kısıtlamaları (iş kuralları)
            builder.Property(sf => sf.IbanNumber).HasMaxLength(34).IsRequired();

            // Bire-Bir (One-to-One) İlişki Tanımı:
            // Her SellerFinance bir Seller'a aittir, her Seller'ın bir FinanceInfo'su vardır.
            builder.HasOne(sf => sf.Seller)
                   .WithOne(s => s.FinanceInfo)
                   .HasForeignKey<SellerFinance>(sf => sf.SellerId); // Foreign Key belirtildi
        }
    }
}