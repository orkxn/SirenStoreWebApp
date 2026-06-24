using AutoMapper;
using Entities.Models;
using FluentValidation;
using SirenStore.Application.DTOs;
using SirenStore.Application.Exceptions;
using SirenStore.Application.Interfaces; 

namespace SirenStore.Application.Services
{
    // IMapper mapper parametresini sınıfın yanına (Primary Constructor) ekledim
    public class SellerManager(
        IRepository<Seller> sellerRepository,
        IMapper mapper,
        IValidator<CreateSellerDto> createSellerValidator) : ISellerService
    {
        public async Task<IEnumerable<SellerDto>> GetAllSellersAsync()
        {
            var sellers = await sellerRepository.GetAllAsync();
            return mapper.Map<IEnumerable<SellerDto>>(sellers);
        }

        public async Task<SellerDto> GetSellerByIdAsync(long id)
        {
            var seller = await sellerRepository.GetByIdAsync(id);
            if (seller == null)
                throw new NotFoundException("Satıcı", id);

            return mapper.Map<SellerDto>(seller);
        }

        public async Task CreateSellerAsync(CreateSellerDto dto)
        {
            await createSellerValidator.ValidateAndThrowAsync(dto);

            var seller = mapper.Map<Seller>(dto);

            seller.IsApproved = false;
            seller.IsActive = true;

            await sellerRepository.AddAsync(seller);
            await sellerRepository.SaveChangesAsync();
        }

        // ISellerService sözleşmesinde yer alan eksik metodu ekledim
        public async Task ToggleAccountStatusAsync(long sellerId)
        {
            var seller = await sellerRepository.GetByIdAsync(sellerId);

            // KONTROL: Satıcı veri tabanında hiç yoksa VEYA Admin tarafından tamamen silinmişse (IsDeleted) işlem yapma!
            if (seller == null || seller.IsDeleted)
                throw new NotFoundException("Satıcı", sellerId);

            // 🔄 SİHİRLİ SATIR: Aktifse pasif, pasifse aktif yapar!
            seller.IsActive = !seller.IsActive;

            sellerRepository.Update(seller);
            await sellerRepository.SaveChangesAsync();
        }
    }
}