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

        // 1. SEPETİ GETİR
        public async Task<BasketDto> GetBasketAsync(long userId)
        {
            var basketDto = await _basketRepository.AsQueryable()
                .Where(b => b.UserId == userId)
                .Select(b => new BasketDto
                {
                    Id = b.Id,
                    // Sadece Global Query Filter'a takılmamış ürünleri sepet listesine alıyoruz
                    Items = b.BasketItems
                        .Where(bi => bi.Product != null)
                        .Select(bi => new BasketItemDto
                        {
                            Id = bi.Id,
                            // bi.Product null olmadığı için ProductId'nin de kesinlikle bir karşılığı vardır (.Value ile güvenle long'a çeviriyoruz)
                            ProductId = bi.ProductId!.Value,
                            ProductName = bi.Product!.Name,
                            Price = bi.Product!.Price,
                            Quantity = bi.Quantity,

                            // DÜZELTME: Buradaki bi.Product'lara da ünlem eklendi
                            ProductImageUrl = bi.Product!.ProductImages.Where(img => img.IsMain).Select(img => img.ImageUrl).FirstOrDefault()
                                              ?? bi.Product!.ProductImages.Select(img => img.ImageUrl).FirstOrDefault()
                        }).ToList()
                })
                .FirstOrDefaultAsync();

            // Eğer veritabanında henüz bu kullanıcıya ait bir sepet kaydı oluşmadıysa, frontend patlamasın diye boş bir model dönüyoruz
            return basketDto ?? new BasketDto();
        }

        // 2. SEPETE ÜRÜN EKLE (Veya Adet Artır)
        public async Task AddToBasketAsync(long userId, AddToBasketDto dto)
        {
            await _validator.ValidateAndThrowAsync(dto);

            // Ürün gerçekten var mı ve aktif mi kontrolü
            var product = await _productRepository.GetAsync(p => p.Id == dto.ProductId);
            if (product == null)
                throw new NotFoundException("Eklemek istediğiniz ürün bulunamadı.");

            if (product.Stock < dto.Quantity)
                throw new BusinessRuleException($"Yetersiz stok! Mağazada sadece {product.Stock} adet ürün var.");

            // Kullanıcının sepetini bul, yoksa yeni sepet oluştur
            var basket = await _basketRepository.AsQueryable()
                .Include(b => b.BasketItems)
                .FirstOrDefaultAsync(b => b.UserId == userId);

            if (basket == null)
            {
                basket = new Basket { UserId = userId };
                await _basketRepository.AddAsync(basket);
                await _basketRepository.SaveChangesAsync(); 
            }

            // Ürün sepette zaten var mı?
            var existingItem = basket.BasketItems.FirstOrDefault(bi => bi.ProductId == dto.ProductId);

            if (existingItem != null)
            {
                // Toplam adet stok sınırını aşıyor mu?
                if (product.Stock < (existingItem.Quantity + dto.Quantity))
                    throw new BusinessRuleException($"Sepetinizdeki toplam adet ({existingItem.Quantity + dto.Quantity}) mağaza stokunu ({product.Stock}) aşamaz.");

                existingItem.Quantity += dto.Quantity;
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

        // 3. SEPETTEKİ ADEDİ DOĞRUDAN GÜNCELLE
        public async Task UpdateBasketItemQuantityAsync(long userId, AddToBasketDto dto)
        {
            await _validator.ValidateAndThrowAsync(dto);

            var basket = await _basketRepository.AsQueryable()
                .Include(b => b.BasketItems)
                .FirstOrDefaultAsync(b => b.UserId == userId);

            if (basket == null)
                throw new NotFoundException("Sepetiniz bulunamadı.");

            var basketItem = basket.BasketItems.FirstOrDefault(bi => bi.ProductId == dto.ProductId);
            if (basketItem == null)
                throw new NotFoundException("Ürün sepetinizde bulunmuyor.");

            var product = await _productRepository.GetAsync(p => p.Id == dto.ProductId);
            if (product != null && product.Stock < dto.Quantity)
                throw new BusinessRuleException($"Yetersiz stok! Bu üründen en fazla {product.Stock} adet seçebilirsiniz.");

            basketItem.Quantity = dto.Quantity;
            _basketItemRepository.Update(basketItem);
            await _basketItemRepository.SaveChangesAsync();
        }

        // 4. SEPETTEN ÜRÜN SİL
        public async Task RemoveFromBasketAsync(long userId, long productId)
        {
            var basket = await _basketRepository.AsQueryable()
                .Include(b => b.BasketItems)
                .FirstOrDefaultAsync(b => b.UserId == userId);

            if (basket == null) return;

            var itemToRemove = basket.BasketItems.FirstOrDefault(bi => bi.ProductId == productId);
            if (itemToRemove != null)
            {
                _basketItemRepository.Remove(itemToRemove);
                await _basketItemRepository.SaveChangesAsync();
            }
        }

        // 5. SEPETİ TAMAMEN BOŞALT
        public async Task ClearBasketAsync(long userId)
        {
            var basket = await _basketRepository.AsQueryable()
                .Include(b => b.BasketItems)
                .FirstOrDefaultAsync(b => b.UserId == userId);

            if (basket != null && basket.BasketItems.Any())
            {
                foreach (var item in basket.BasketItems.ToList())
                {
                    _basketItemRepository.Remove(item);
                }
                await _basketItemRepository.SaveChangesAsync();
            }
        }
    }
}