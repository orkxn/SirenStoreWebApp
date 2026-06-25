using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.ToTable("products");

            builder.HasKey(p => p.Id);

            // Ürün adı zorunlu ve en fazla 150 karakter
            builder.Property(p => p.Name)
                .IsRequired()
                .HasMaxLength(150);

            // Açıklama zorunlu ve uzun metin olabileceği için 1000 karakter sınırında
            builder.Property(p => p.Description)
                .IsRequired()
                .HasMaxLength(1000);

            // PostgreSQL için decimal hassasiyeti (18 basamak toplam uzunluk, 2 basamak kuruş)
            builder.Property(p => p.Price)
                .HasColumnType("decimal(18,2)");

            // Global Query Filter: Silinmiş ürünler default olarak sorgularda gelmez
            builder.HasQueryFilter(p => !p.IsDeleted);

            // Kategori ile 1-to-Many İlişkisi
            builder.HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict); // Kategori silindiğinde altındaki ürünler hata vermesin, korunarak kalsın (Güvenli yaklaşım)

            // Satıcı ile 1-to-Many İlişkisi
            builder.HasOne(p => p.Seller)
                .WithMany(s => s.Products)
                .HasForeignKey(p => p.SellerId)
                .OnDelete(DeleteBehavior.Cascade); // Satıcı dükkanı tamamen silinirse, o dükkanın tüm ürünleri de otomatik silinsin
        }
    }
}