using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    public class ProductImageConfiguration : IEntityTypeConfiguration<ProductImage>
    {
        public void Configure(EntityTypeBuilder<ProductImage> builder)
        {
            builder.ToTable("product_images");

            builder.HasKey(pi => pi.Id);

            // Resim URL alanı zorunlu ve maksimum 500 karakter (Uzun bulut depolama linkleri için ideal)
            builder.Property(pi => pi.ImageUrl)
                .IsRequired()
                .HasMaxLength(500);

            // Ana vitrin resmi alanı varsayılan olarak false
            builder.Property(pi => pi.IsMain)
                .HasDefaultValue(false);

            // Ürün ile 1-to-Many İlişkisi
            builder.HasOne(pi => pi.Product)
                .WithMany(p => p.ProductImages)
                .HasForeignKey(pi => pi.ProductId)
                .OnDelete(DeleteBehavior.Cascade); 
        }
    }
}