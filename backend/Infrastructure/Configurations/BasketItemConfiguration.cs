using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    public class BasketItemConfiguration : IEntityTypeConfiguration<BasketItem>
    {
        public void Configure(EntityTypeBuilder<BasketItem> builder)
        {
            builder.ToTable("basket_items");

            // sepet ile ilişki bire çok
            builder.HasOne(bi => bi.Basket)
                .WithMany(b => b.BasketItems)
                .HasForeignKey(bi => bi.BasketId)
                .OnDelete(DeleteBehavior.Cascade);

            // ürün ile ilişki bire çok
            builder.HasOne(bi => bi.Product)
                .WithMany()
                .HasForeignKey(bi => bi.ProductId)
                .OnDelete(DeleteBehavior.Restrict); 

            builder.Property(bi => bi.Quantity)
                .IsRequired()
                .HasDefaultValue(1);
        }
    }
}