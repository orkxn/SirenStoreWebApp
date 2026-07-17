using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SirenStore.Infrastructure.Configurations
{
    public class FavoriteConfiguration : IEntityTypeConfiguration<Favorite>
    {
        public void Configure(EntityTypeBuilder<Favorite> builder)
        {
            builder.HasKey(f => f.Id);

            // İlişkiler
            builder.HasOne(f => f.User)
                .WithMany()
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(f => f.Product)
                .WithMany()
                .HasForeignKey(f => f.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            // Filtrelenmiş tekil indeks: Bir kullanıcı aynı ürünü yalnızca 1 kez favorileyebilir
            builder.HasIndex(f => new { f.UserId, f.ProductId })
                .IsUnique()
                .HasFilter("is_deleted = false");

            // Global soft-delete filtresi
            builder.HasQueryFilter(f => !f.IsDeleted);
        }
    }
}
