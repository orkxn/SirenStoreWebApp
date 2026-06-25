using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    public class BasketConfiguration : IEntityTypeConfiguration<Basket>
    {
        public void Configure(EntityTypeBuilder<Basket> builder)
        {
            builder.ToTable("baskets");

            // Bir kullanıcının yalnızca BİR sepeti olabilir (One-to-One)
            builder.HasOne(b => b.User)
                .WithOne() // User entity'sinde ICollection<Basket> veya Basket mülkü açmadıysak boş bırakıyoruz
                .HasForeignKey<Basket>(b => b.UserId)
                .OnDelete(DeleteBehavior.Cascade); // Kullanıcı silinirse sepeti de silinsin
        }
    }
}