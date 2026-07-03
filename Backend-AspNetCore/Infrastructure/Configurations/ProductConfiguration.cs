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

            builder.Property(p => p.Name)
                .IsRequired()
                .HasMaxLength(150);

            builder.Property(p => p.Description)
                .IsRequired()
                .HasMaxLength(10000);

            builder.Property(p => p.Price)
                .HasColumnType("decimal(18,2)");

            // Global Query Filter: silinmiş ürünler veya silinmiş satıcıların ürünleri default olarak sorgularda gelmez
            builder.HasQueryFilter(p => !p.IsDeleted && !p.Seller.IsDeleted);

            // bire çok ilişki var
            builder.HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict); // kategori silinirse ürünler silinmesin, sadece kategori silinsin

            // Satıcı ile 1-to-Many İlişkisi
            builder.HasOne(p => p.Seller)
                .WithMany(s => s.Products)
                .HasForeignKey(p => p.SellerId)
                .OnDelete(DeleteBehavior.Cascade); // satıcı silinirse ürünlerin tamamı da silinsin

            // Çoktan çoğa ilişki: Ürünler ve Etiketler arasında (product_tags ara tablosu)
            builder.HasMany(p => p.Tags)
                .WithMany(t => t.Products)
                .UsingEntity<Dictionary<string, object>>(
                    "product_tags",
                    j => j.HasOne<Tag>().WithMany().HasForeignKey("tag_id").OnDelete(DeleteBehavior.Cascade),
                    j => j.HasOne<Product>().WithMany().HasForeignKey("product_id").OnDelete(DeleteBehavior.Cascade)
                );
        }
    }
}