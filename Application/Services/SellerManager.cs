using AutoMapper;
using Entities.Models;
using SirenStore.Application.DTOs;
using SirenStore.Application.Interfaces; // IRepository'nin olduğu yer

namespace SirenStore.Application.Services
{
    // DÜZELTME 1: IMapper mapper parametresini sınıfın yanına (Primary Constructor) ekledik
    public class SellerManager(IRepository<Seller> sellerRepository, IMapper mapper) : ISellerService
    {
        public async Task<IEnumerable<SellerDto>> GetAllSellersAsync()
        {
            var sellers = await sellerRepository.GetAllAsync();
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
            var seller = mapper.Map<Seller>(dto);

            seller.IsApproved = false;
            seller.IsActive = true;

            await sellerRepository.AddAsync(seller);
            await sellerRepository.SaveChangesAsync(); // Değişiklikleri kaydetmeyi unutmayalım
        }

        // DÜZELTME 2: ISellerService sözleşmesinde yer alan eksik metodu ekledik
        public async Task ApproveSellerAsync(long sellerId)
        {
            var seller = await sellerRepository.GetByIdAsync(sellerId);
            if (seller == null) throw new Exception("Satıcı bulunamadı!");

            seller.IsApproved = true;
            sellerRepository.Update(seller);
            await sellerRepository.SaveChangesAsync();
        }
    }
}