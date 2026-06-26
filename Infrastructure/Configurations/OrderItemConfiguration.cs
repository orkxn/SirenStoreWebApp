using Entities.Models;
using Entities.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
    {
        public void Configure(EntityTypeBuilder<OrderItem> builder)
        {
            builder.ToTable("order_items");

            builder.Property(oi => oi.Price).HasColumnType("numeric(18,2)").IsRequired();

            // Order - OrderItem (Bire-Çok)
            builder.HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade); 

            // Product - OrderItem
            builder.HasOne(oi => oi.Product)
                .WithMany()
                .HasForeignKey(oi => oi.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(oi => oi.Status)
                .IsRequired();
        }
    }
}