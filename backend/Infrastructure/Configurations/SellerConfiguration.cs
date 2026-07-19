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

            builder.Property(s => s.StoreName)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(s => s.TaxNumber)
                .HasMaxLength(11);

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

            // bire bir ilişki, bir userın bir satıcısı olur sadece
            builder.HasOne(s => s.User)
                .WithOne(u => u.Seller)
                .HasForeignKey<Seller>(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade); // kullanıcı silinirse satıcı kaydı da silinsin
        }
    }
}