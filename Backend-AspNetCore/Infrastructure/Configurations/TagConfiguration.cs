using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    public class TagConfiguration : IEntityTypeConfiguration<Tag>
    {
        public void Configure(EntityTypeBuilder<Tag> builder)
        {
            builder.ToTable("tags");

            builder.HasKey(t => t.Id);

            builder.Property(t => t.Name)
                .IsRequired()
                .HasMaxLength(100);

            // Global Query Filter: matching product's query filter to prevent unexpected results
            builder.HasQueryFilter(t => !t.IsDeleted && !t.Product.IsDeleted && !t.Product.Seller.IsDeleted);

            // Bire çok ilişki: Ürün ile etiketler arasında
            builder.HasOne(t => t.Product)
                .WithMany(p => p.Tags)
                .HasForeignKey(t => t.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
