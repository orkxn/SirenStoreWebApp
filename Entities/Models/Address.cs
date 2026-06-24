namespace Entities.Models
{
    public class Address : BaseModel
    {
        // "Ev Adresim", "İş Adresim" gibi başlıklar
        public string Title { get; set; }

        // İl, İlçe, Mahalle ve Açık Adres
        public string City { get; set; }
        public string District { get; set; }
        public string Neighborhood { get; set; }
        public string FullAddress { get; set; }
        public string? ZipCode { get; set; } 

        public long UserId { get; set; }
        public User User { get; set; }
    }
}