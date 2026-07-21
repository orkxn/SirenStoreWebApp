using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.ToTable("orders");

            builder.Property(o => o.TotalPrice).HasColumnType("numeric(18,2)").IsRequired();
            builder.Property(o => o.AddressTitle).HasMaxLength(100).IsRequired();
            builder.Property(o => o.ShippingAddress).HasMaxLength(500).IsRequired();

            builder.HasIndex(o => o.CreationDate);

            // bire çok ilişki
            builder.HasOne(o => o.User)
                .WithMany()
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Restrict); 
        }
    }
}