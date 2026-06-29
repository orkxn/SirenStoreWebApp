using Entities.Models;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using SirenStore.Application.DTOs;
using SirenStore.Application.Interfaces;
using SirenStore.Application.Exceptions; 

namespace SirenStore.Application.Services
{
    public class BasketManager : IBasketService
    {
        private readonly IRepository<Basket> _basketRepository;
        private readonly IRepository<BasketItem> _basketItemRepository;
        private readonly IRepository<Product> _productRepository;
        private readonly IValidator<AddToBasketDto> _validator;

        public BasketManager(
            IRepository<Basket> basketRepository,
            IRepository<BasketItem> basketItemRepository,
            IRepository<Product> productRepository,
            IValidator<AddToBasketDto> validator)
        {
            _basketRepository = basketRepository;
            _basketItemRepository = basketItemRepository;
            _productRepository = productRepository;
            _validator = validator;
        }

        // sepeti getir
        public async Task<BasketDto> GetBasketAsync(long userId)
        {
            var basketDto = await _basketRepository.AsQueryable()
                .Where(b => b.UserId == userId)
                .Select(b => new BasketDto
                {
                    Id = b.Id,
                    // delete olmamış ve product null olmayan ürünleri getiriyoruz
                    Items = b.BasketItems
                        .Where(bi => !bi.IsDeleted && bi.Product != null)
                        .Select(bi => new BasketItemDto
                        {
                            Id = bi.Id,
                            ProductId = bi.ProductId!.Value,
                            ProductName = bi.Product!.Name,
                            Price = bi.Product!.Price,
                            Quantity = bi.Quantity,

                            ProductImageUrl = bi.Product!.ProductImages.Where(img => img.IsMain).Select(img => img.ImageUrl).FirstOrDefault()
                                              ?? bi.Product!.ProductImages.Select(img => img.ImageUrl).FirstOrDefault()
                        }).ToList()
                })
                .FirstOrDefaultAsync();

            // veritabanında sepet yoksa boş bir sepet döndür, yenisini oluşturmak istemiyoruz, sadece boş bir DTO döndürüyoruz
            return basketDto ?? new BasketDto();
        }

        // sepete ürün ekle
        public async Task AddToBasketAsync(long userId, AddToBasketDto dto)
        {
            await _validator.ValidateAndThrowAsync(dto);

            // ürün var mı ve aktif mi
            var product = await _productRepository.GetAsync(p => p.Id == dto.ProductId);
            if (product == null)
                throw new NotFoundException("Eklemek istediğiniz ürün bulunamadı.");

            if (product.Stock < dto.Quantity)
                throw new BusinessRuleException($"Yetersiz stok! Mağazada sadece {product.Stock} adet ürün var.");

            // sepeti bul, yoksa oluştur
            var basket = await _basketRepository.AsQueryable()
                .Include(b => b.BasketItems)
                .FirstOrDefaultAsync(b => b.UserId == userId);

            if (basket == null)
            {
                basket = new Basket { UserId = userId };
                await _basketRepository.AddAsync(basket);
                await _basketRepository.SaveChangesAsync(); 
            }

            // ürün sepette zaten var mı
            var existingItem = basket.BasketItems.FirstOrDefault(bi => bi.ProductId == dto.ProductId);

            if (existingItem != null)
            {
                if (existingItem.IsDeleted)
                {
                    // Eğer önceden silinmişse geri aktifleştir
                    existingItem.IsDeleted = false;
                    existingItem.Quantity = dto.Quantity;
                }
                else 
                {
                    // toplamı stoğu aşmaması için kontrol et
                    if (product.Stock < (existingItem.Quantity + dto.Quantity))
                        throw new BusinessRuleException($"Sepetinizdeki toplam adet ({existingItem.Quantity + dto.Quantity}) mağaza stokunu ({product.Stock}) aşamaz.");

                    existingItem.Quantity += dto.Quantity;
                }
                
                _basketItemRepository.Update(existingItem);
            }
            else
            {
                var newItem = new BasketItem
                {
                    BasketId = basket.Id,
                    ProductId = dto.ProductId,
                    Quantity = dto.Quantity
                };
                await _basketItemRepository.AddAsync(newItem);
            }

            await _basketItemRepository.SaveChangesAsync();
        }

        // sepetteki ürünün miktarını güncelle
        public async Task UpdateBasketItemQuantityAsync(long userId, AddToBasketDto dto)
        {
            await _validator.ValidateAndThrowAsync(dto);

            var basket = await _basketRepository.AsQueryable()
                .Include(b => b.BasketItems)
                .FirstOrDefaultAsync(b => b.UserId == userId);

            if (basket == null)
                throw new NotFoundException("Sepetiniz bulunamadı.");

            var basketItem = basket.BasketItems.FirstOrDefault(bi => bi.ProductId == dto.ProductId && !bi.IsDeleted);
            if (basketItem == null)
                throw new NotFoundException("Ürün sepetinizde bulunmuyor.");

            var product = await _productRepository.GetAsync(p => p.Id == dto.ProductId);
            if (product != null && product.Stock < dto.Quantity)
                throw new BusinessRuleException($"Yetersiz stok! Bu üründen en fazla {product.Stock} adet seçebilirsiniz.");

            basketItem.Quantity = dto.Quantity;
            _basketItemRepository.Update(basketItem);
            await _basketItemRepository.SaveChangesAsync();
        }

        // sepetten ürün kaldır
        public async Task RemoveFromBasketAsync(long userId, long productId)
        {
            var basket = await _basketRepository.AsQueryable()
                .Include(b => b.BasketItems)
                .FirstOrDefaultAsync(b => b.UserId == userId);

            if (basket == null) return;

            var itemToRemove = basket.BasketItems.FirstOrDefault(bi => bi.ProductId == productId && !bi.IsDeleted);
            if (itemToRemove != null)
            {
                _basketItemRepository.Remove(itemToRemove);
                await _basketItemRepository.SaveChangesAsync();
            }
        }

        // sepeti tamamen temizle
        public async Task ClearBasketAsync(long userId)
        {
            var basket = await _basketRepository.AsQueryable()
                .Include(b => b.BasketItems)
                .FirstOrDefaultAsync(b => b.UserId == userId);

            if (basket != null && basket.BasketItems.Any(bi => !bi.IsDeleted))
            {
                foreach (var item in basket.BasketItems.Where(bi => !bi.IsDeleted).ToList())
                {
                    _basketItemRepository.Remove(item);
                }
                await _basketItemRepository.SaveChangesAsync();
            }
        }
    }
}