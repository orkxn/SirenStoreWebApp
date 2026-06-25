using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    public class SellerConfiguration : IEntityTypeConfiguration<Seller>
    {
        public void Configure(EntityTypeBuilder<Seller> builder)
        {
            builder.ToTable("sellers");

            // Mağaza adı zorunlu ve en fazla 100 karakter
            builder.Property(s => s.StoreName)
                .IsRequired()
                .HasMaxLength(100);

            // Vergi numarası zorunlu ve tam 10 karakter (Türkiye standartları)
            builder.Property(s => s.TaxNumber)
                .IsRequired()
                .HasMaxLength(10);

            builder.Property(s => s.TaxOffice)
                .HasMaxLength(50);

            // User ile Bire Bir (1-to-1) İlişki Tanımı
            builder.HasOne(s => s.User)
                .WithOne() // Eğer User içinde "public Seller Seller {get;}" olsaydı .WithOne(u => u.Seller) yazardık.
                .HasForeignKey<Seller>(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade); // Kullanıcı silinirse satıcı kaydı da silinsin
        }
    }
}