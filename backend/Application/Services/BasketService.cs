using Entities.Models;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using SirenStore.Application.DTOs;
using SirenStore.Application.Exceptions; 

namespace SirenStore.Application.Services
{
    public class BasketService
    {
        private readonly DbContext _context;
        private readonly IValidator<AddToBasketDto> _validator;
        private readonly AuditLogService _auditLogService;

        public BasketService(
            DbContext context,
            IValidator<AddToBasketDto> validator,
            AuditLogService auditLogService)
        {
            _context = context;
            _validator = validator;
            _auditLogService = auditLogService;
        }

        // sepeti getir
        public async Task<BasketDto> GetBasketAsync(long userId)
        {
            var basketDto = await _context.Set<Basket>()
                .Where(b => b.UserId == userId && !b.IsDeleted)
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
            var product = await _context.Set<Product>()
                .Include(p => p.Seller)
                .FirstOrDefaultAsync(p => p.Id == dto.ProductId && !p.IsDeleted);

            if (product == null)
                throw new NotFoundException("Eklemek istediğiniz ürün bulunamadı.");

            if (product.Seller != null && product.Seller.UserId == userId)
                throw new BusinessRuleException("Kendi ürününüzü sepetinize ekleyemezsiniz.");

            if (product.Stock < dto.Quantity)
                throw new BusinessRuleException($"Yetersiz stok! Mağazada sadece {product.Stock} adet ürün var.");

            // sepeti bul, yoksa oluştur
            var basket = await _context.Set<Basket>()
                .Include(b => b.BasketItems)
                .FirstOrDefaultAsync(b => b.UserId == userId && !b.IsDeleted);

            if (basket == null)
            {
                basket = new Basket { UserId = userId };
                await _context.Set<Basket>().AddAsync(basket);
                await _context.SaveChangesAsync(); 
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
            }
            else
            {
                var newItem = new BasketItem
                {
                    BasketId = basket.Id,
                    ProductId = dto.ProductId,
                    Quantity = dto.Quantity
                };
                await _context.Set<BasketItem>().AddAsync(newItem);
            }

            await _context.SaveChangesAsync();

            // audit: Sepete ürün ekleme logu
            await _auditLogService.LogAuditAsync(userId, "BASKET_ITEM_ADDED", "Product", dto.ProductId, $"Quantity: {dto.Quantity}");
        }

        // sepetteki ürünün miktarını güncelle
        public async Task UpdateBasketItemQuantityAsync(long userId, AddToBasketDto dto)
        {
            await _validator.ValidateAndThrowAsync(dto);

            var basket = await _context.Set<Basket>()
                .Include(b => b.BasketItems)
                .FirstOrDefaultAsync(b => b.UserId == userId && !b.IsDeleted);

            if (basket == null)
                throw new NotFoundException("Sepetiniz bulunamadı.");

            var basketItem = basket.BasketItems.FirstOrDefault(bi => bi.ProductId == dto.ProductId && !bi.IsDeleted);
            if (basketItem == null)
                throw new NotFoundException("Ürün sepetinizde bulunmuyor.");

            var product = await _context.Set<Product>().FirstOrDefaultAsync(p => p.Id == dto.ProductId && !p.IsDeleted);
            if (product != null && product.Stock < dto.Quantity)
                throw new BusinessRuleException($"Yetersiz stok! Bu üründen en fazla {product.Stock} adet seçebilirsiniz.");

            basketItem.Quantity = dto.Quantity;
            await _context.SaveChangesAsync();

            // audit: Sepet ürün adedi güncelleme logu
            await _auditLogService.LogAuditAsync(userId, "BASKET_ITEM_QUANTITY_UPDATED", "Product", dto.ProductId, $"NewQuantity: {dto.Quantity}");
        }

        // sepetten ürün kaldır
        public async Task RemoveFromBasketAsync(long userId, long productId)
        {
            var basket = await _context.Set<Basket>()
                .Include(b => b.BasketItems)
                .FirstOrDefaultAsync(b => b.UserId == userId && !b.IsDeleted);

            if (basket == null) return;

            var itemToRemove = basket.BasketItems.FirstOrDefault(bi => bi.ProductId == productId && !bi.IsDeleted);
            if (itemToRemove != null)
            {
                itemToRemove.IsDeleted = true;
                await _context.SaveChangesAsync();

                // audit: Sepetten ürün silme logu
                await _auditLogService.LogAuditAsync(userId, "BASKET_ITEM_REMOVED", "Product", productId, $"ProductId: {productId}");
            }
        }

        // sepeti tamamen temizle
        public async Task ClearBasketAsync(long userId)
        {
            var basket = await _context.Set<Basket>()
                .Include(b => b.BasketItems)
                .FirstOrDefaultAsync(b => b.UserId == userId && !b.IsDeleted);

            if (basket != null && basket.BasketItems.Any(bi => !bi.IsDeleted))
            {
                foreach (var item in basket.BasketItems.Where(bi => !bi.IsDeleted).ToList())
                {
                    item.IsDeleted = true;
                }
                await _context.SaveChangesAsync();

                // audit: Sepet temizleme logu
                await _auditLogService.LogAuditAsync(userId, "BASKET_CLEARED", "Basket", basket.Id, "Basket cleared");
            }
        }
    }
}