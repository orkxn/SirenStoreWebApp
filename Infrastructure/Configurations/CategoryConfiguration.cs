using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    public class CategoryConfiguration : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> builder)
        {
            // Tablo adı eşleştirmesi (DbContext'teki snake_case metodun bunu otomatik category_entities yapmasın diye garantiye alıyoruz)
            builder.ToTable("categories");

            builder.HasKey(c => c.Id);

            // Kategori adı zorunlu ve maksimum 50 karakter
            builder.Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(50);

            // Açıklama opsiyonel ama sınırlandırılmış
            builder.Property(c => c.Description)
                .HasMaxLength(200);

            // Global Query Filter: Silinmiş (IsDeleted = true) kategoriler listelemelerde otomatik olarak gizlenir
            builder.HasQueryFilter(c => !c.IsDeleted);
        }
    }
}