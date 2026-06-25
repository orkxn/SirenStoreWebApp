namespace Entities.Models
{
    public class ProductImage : BaseModel
    {
        // Fotoğrafın sunucudaki veya AWS S3 / Cloudinary gibi bir yerdeki dosya yolu
        public string ImageUrl { get; set; } = string.Empty;

        // Bu fotoğrafın ana vitrin fotoğrafı olup olmadığını belirler (Örn: Listeleme ekranında görünecek ilk resim)
        public bool IsMain { get; set; } = false;

        // Ürün İlişkisi (Bu fotoğraf hangi ürüne ait?)
        public long ProductId { get; set; }
        public virtual Product Product { get; set; } = null!;
    }
}