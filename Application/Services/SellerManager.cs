using AutoMapper;
using Entities.Models;
using SirenStore.Application.Interfaces; // IRepository'nin olduğu yer

namespace SirenStore.Application.Services
{
    public class SellerManager(IRepository<Seller> sellerRepository) : ISellerService
    {
        // Artık veritabanı işlemlerini bu sellerRepository üzerinden yapacaksın

        public async Task<IEnumerable<SellerDto>> GetAllSellersAsync()
        {
            // Veri tabanından silinmemiş (IsDeleted = false) satıcıları çeker
            var sellers = await sellerRepository.GetAllAsync();

            // Çıplak entity listesini, Angular'ın anlayacağı SellerDto listesine otomatik çevirir
            return mapper.Map<IEnumerable<SellerDto>>(sellers);
        }

        public async Task<SellerDto?> GetSellerByIdAsync(long id)
        {
            var seller = await sellerRepository.GetByIdAsync(id);
            if (seller == null) return null;

            return mapper.Map<SellerDto>(seller);
        }

        public async Task CreateSellerAsync(CreateSellerDto dto)
        {
            // Angular'dan gelen kayıt formunu (DTO) gerçek veri tabanı modeline (Entity) çevirir
            var seller = mapper.Map<Seller>(dto);

            // İş Mantığı Kuralları:
            seller.IsApproved = false; // Yeni kayıt olan satıcı doğrudan onaylı başlamaz, incelemeye düşer
            seller.IsActive = true;     // Mağaza varsayılan olarak aktif başlar

            // Depoya ekleme emri verilir
            await sellerRepository.AddAsync(seller);

            // Değişiklikler PostgreSQL'e fiziksel olarak kilitlenir
            await sellerRepository.SaveChangesAsync();
        }

        public async Task ApproveSellerAsync(long sellerId)
        {
            var seller = await sellerRepository.GetByIdAsync(sellerId);
            if (seller == null) throw new Exception("Satıcı bulunamadı!");

            // İş mantığı devreye giriyor:
            seller.IsApproved = true;
            sellerRepository.Update(seller);
            await sellerRepository.SaveChangesAsync();

            // (İleride buraya: "Satıcıya onay maili at" kodu da eklenecek)
        }

        // Diğer metotların içleri de benzer şekilde doldurulacak...
    }
}