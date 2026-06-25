namespace SirenStore.Application.DTOs
{
    public class SellerPublicProfileDto
    {
        public long Id { get; set; }

        public string StoreName { get; set; } = string.Empty;

        // Veritabanında kolonu yoktur, Manager katmanında dinamik (Dicebear API) üretilir.
        public string StoreLogoUrl { get; set; } = string.Empty;

        // Satıcının bağlı olduğu User tablosundan birleştirilen Ad Soyad.
        public string OwnerFullName { get; set; } = string.Empty;

        // Satıcının User tablosundaki kayıtlı telefon numarasını dışarıya açıyoruz.
        public string ContactLine { get; set; } = string.Empty;

        // Satıcıya ait aktif ürünlerin listesi.
        public List<ProductListDto> Products { get; set; } = new List<ProductListDto>();
    }
}