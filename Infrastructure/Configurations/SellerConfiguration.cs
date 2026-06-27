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

            // Vergi numarası opsiyonel ve en fazla 10 karakter
            builder.Property(s => s.TaxNumber)
                .HasMaxLength(10);

            builder.Property(s => s.TaxOffice)
                .HasMaxLength(50);

            builder.Property(s => s.ContactEmail)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(s => s.ContactPhone)
                .IsRequired()
                .HasMaxLength(20);

            builder.Property(s => s.SupportLine)
                .IsRequired()
                .HasMaxLength(20);

            // User ile Bire Bir (1-to-1) İlişki Tanımı
            builder.HasOne(s => s.User)
                .WithOne(u => u.Seller) // Eğer User içinde "public Seller Seller {get;}" olsaydı .WithOne(u => u.Seller) yazardık.
                .HasForeignKey<Seller>(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade); // Kullanıcı silinirse satıcı kaydı da silinsin
        }
    }
}