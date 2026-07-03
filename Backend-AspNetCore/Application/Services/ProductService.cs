using Entities.Models;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using SirenStore.Application.DTOs;
using SirenStore.Application.Exceptions;

namespace SirenStore.Application.Services
{
    public class ProductService
    {
        private readonly DbContext _context;
        private readonly IValidator<CreateProductDto> _createValidator;
        private readonly IValidator<UpdateProductDto> _updateValidator;
        private readonly AuditLogService _auditLogService;
        private readonly IMemoryCache _cache;
        private const string CacheKeyAll = "Products_All";
        private static string CacheKeyDetail(long id) => $"Product_Detail_{id}";

        public ProductService(
            DbContext context,
            IValidator<CreateProductDto> createValidator,
            IValidator<UpdateProductDto> updateValidator,
            AuditLogService auditLogService,
            IMemoryCache cache)
        {
            _context = context;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
            _auditLogService = auditLogService;
            _cache = cache;
        }

        /// <summary>
        /// Ürünleri ProjectDto'ya dönüştüren ortak SELECT mantığı
        /// Include ve Select işlemlerini bu helper'da topladık (DRY prensibi)
        /// </summary>
        private IQueryable<ProductListDto> GetProductDtoQueryable(IQueryable<Product> query)
        {
            return query
                .Include(p => p.Category)
                .Include(p => p.Seller)
                .Include(p => p.ProductImages)
                .Include(p => p.Tags)
                .Select(p => new ProductListDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category.Name,
                    SellerId = p.SellerId,
                    StoreName = p.Seller.StoreName,
                    MainImageUrl = p.ProductImages.Where(img => img.IsMain).Select(img => img.ImageUrl).FirstOrDefault()
                                   ?? p.ProductImages.Select(img => img.ImageUrl).FirstOrDefault(),
                    ImageUrls = p.ProductImages.Select(img => img.ImageUrl).ToList(),
                    Tags = p.Tags.Where(t => !t.IsDeleted).Select(t => t.Name).ToList()
                });
        }

        // tüm ürünleri listele
        public async Task<IEnumerable<ProductListDto>> GetAllAsync()
        {
            if (!_cache.TryGetValue(CacheKeyAll, out IEnumerable<ProductListDto> products))
            {
                products = await GetProductDtoQueryable(_context.Set<Product>().Where(p => !p.IsDeleted)).ToListAsync();

                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(TimeSpan.FromMinutes(10))
                    .SetSlidingExpiration(TimeSpan.FromMinutes(2));

                _cache.Set(CacheKeyAll, products, cacheEntryOptions);
            }
            return products;
        }

        // satıcının ürünlerini listele
        public async Task<IEnumerable<ProductListDto>> GetMyProductsAsync(long userId)
        {
            var seller = await _context.Set<Seller>().FirstOrDefaultAsync(s => s.UserId == userId && !s.IsDeleted);
            if (seller == null)
                throw new BusinessRuleException("Satıcı profili bulunamadı.");

            return await GetProductDtoQueryable(_context.Set<Product>().Where(p => p.SellerId == seller.Id && !p.IsDeleted)).ToListAsync();
        }

        // kategoriye göre ürünleri listele
        public async Task<IEnumerable<ProductListDto>> GetByCategoryIdAsync(long categoryId)
        {
            // önce kategori var mı kontrolü
            var categoryExists = await _context.Set<Category>().AnyAsync(c => c.Id == categoryId && !c.IsDeleted);
            if (!categoryExists)
                throw new NotFoundException("Belirtilen kategori bulunamadı.");

            return await GetProductDtoQueryable(_context.Set<Product>().Where(p => p.CategoryId == categoryId && !p.IsDeleted)).ToListAsync();
        }

        // ürün detaylarını getir
        public async Task<ProductListDto> GetByIdAsync(long id)
        {
            var key = CacheKeyDetail(id);
            if (!_cache.TryGetValue(key, out ProductListDto productDto))
            {
                productDto = await GetProductDtoQueryable(_context.Set<Product>().Where(p => p.Id == id && !p.IsDeleted)).FirstOrDefaultAsync();

                if (productDto == null)
                    throw new NotFoundException("Ürün bulunamadı.");

                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(TimeSpan.FromMinutes(30))
                    .SetSlidingExpiration(TimeSpan.FromMinutes(5));

                _cache.Set(key, productDto, cacheEntryOptions);
            }
            return productDto;
        }

        // ürün ekle
        public async Task CreateAsync(long userId, CreateProductDto dto)
        {
            // kapıda doğrula
            await _createValidator.ValidateAndThrowAsync(dto);

            // bu işlemi yapan kişinin mağazasını bul
            var seller = await _context.Set<Seller>().FirstOrDefaultAsync(s => s.UserId == userId && !s.IsDeleted);
            if (seller == null || seller.Status != Entities.Enums.SellerStatus.Approved)
                throw new BusinessRuleException("Sadece onaylanmış mağazalar ürün ekleyebilir.");

            // kategori geçerli mi kontrol et
            var categoryExists = await _context.Set<Category>().AnyAsync(c => c.Id == dto.CategoryId && !c.IsDeleted);
            if (!categoryExists)
                throw new NotFoundException("Seçilen kategori geçerli değil.");

            var newProduct = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                Stock = dto.Stock,
                CategoryId = dto.CategoryId,
                SellerId = seller.Id
            };

            if (dto.ImageUrls != null && dto.ImageUrls.Any())
            {
                for (int i = 0; i < dto.ImageUrls.Count; i++)
                {
                    newProduct.ProductImages.Add(new ProductImage
                    {
                        ImageUrl = dto.ImageUrls[i],
                        IsMain = (i == 0)
                    });
                }
            }

            if (dto.Tags != null && dto.Tags.Any())
            {
                foreach (var tagName in dto.Tags.Select(t => t.Trim().ToLower()).Distinct())
                {
                    if (string.IsNullOrWhiteSpace(tagName)) continue;

                    var tag = await _context.Set<Tag>().FirstOrDefaultAsync(t => t.Name.ToLower() == tagName && !t.IsDeleted);
                    if (tag == null)
                    {
                        tag = new Tag { Name = tagName };
                        await _context.Set<Tag>().AddAsync(tag);
                    }
                    newProduct.Tags.Add(tag);
                }
            }

            await _context.Set<Product>().AddAsync(newProduct);
            await _context.SaveChangesAsync();
            _cache.Remove(CacheKeyAll);

            // audit: Ürün oluşturma logu
            await _auditLogService.LogAuditAsync(userId, "PRODUCT_CREATED", "Product", newProduct.Id, $"Name: {newProduct.Name}");
        }

        // ürün güncelleme
        public async Task UpdateAsync(long userId, UpdateProductDto dto)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

            // işlemi yapan kişinin satıcı profilini bul
            var seller = await _context.Set<Seller>().FirstOrDefaultAsync(s => s.UserId == userId && !s.IsDeleted);
            if (seller == null)
                throw new BusinessRuleException("Satıcı profili bulunamadı.");

            // güncellenecek ürünü bul
            var product = await _context.Set<Product>()
                .Include(p => p.ProductImages)
                .Include(p => p.Tags)
                .FirstOrDefaultAsync(p => p.Id == dto.Id && !p.IsDeleted);

            if (product == null)
                throw new NotFoundException("Güncellenmek istenen ürün bulunamadı.");

            // idor koruması
            if (product.SellerId != seller.Id)
                throw new BusinessRuleException("Bu ürünü güncelleme yetkiniz bulunmamaktadır!");

            // kategori kontrolü
            var categoryExists = await _context.Set<Category>().AnyAsync(c => c.Id == dto.CategoryId && !c.IsDeleted);
            if (!categoryExists)
                throw new NotFoundException("Seçilen kategori geçerli değil.");

            // güncelleme lojiği
            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.Stock = dto.Stock;
            product.CategoryId = dto.CategoryId;

            product.ProductImages.Clear();
            product.Tags.Clear();

            if (dto.ImageUrls != null && dto.ImageUrls.Any())
            {
                for (int i = 0; i < dto.ImageUrls.Count; i++)
                {
                    product.ProductImages.Add(new ProductImage
                    {
                        ImageUrl = dto.ImageUrls[i],
                        IsMain = (i == 0) 
                    });
                }
            }

            if (dto.Tags != null && dto.Tags.Any())
            {
                foreach (var tagName in dto.Tags.Select(t => t.Trim().ToLower()).Distinct())
                {
                    if (string.IsNullOrWhiteSpace(tagName)) continue;

                    var tag = await _context.Set<Tag>().FirstOrDefaultAsync(t => t.Name.ToLower() == tagName && !t.IsDeleted);
                    if (tag == null)
                    {
                        tag = new Tag { Name = tagName };
                        await _context.Set<Tag>().AddAsync(tag);
                    }
                    product.Tags.Add(tag);
                }
            }

            await _context.SaveChangesAsync();
            _cache.Remove(CacheKeyAll);
            _cache.Remove(CacheKeyDetail(product.Id));

            // audit: Ürün güncelleme logu
            await _auditLogService.LogAuditAsync(userId, "PRODUCT_UPDATED", "Product", product.Id, $"Name: {product.Name}");
        }

        // ürünü silme
        public async Task DeleteAsync(long userId, long productId)
        {
            var seller = await _context.Set<Seller>().FirstOrDefaultAsync(s => s.UserId == userId && !s.IsDeleted);
            if (seller == null)
                throw new BusinessRuleException("Satıcı profili bulunamadı.");

            var product = await _context.Set<Product>().FirstOrDefaultAsync(p => p.Id == productId && !p.IsDeleted);
            if (product == null)
                throw new NotFoundException("Silinmek istenen ürün bulunamadı.");

            if (product.SellerId != seller.Id)
                throw new BusinessRuleException("Bu ürünü silme yetkiniz bulunmamaktadır!");

            product.IsDeleted = true;

            // bu ürünün olduğu tüm sepetlerden ürünü sil 
            var basketItems = await _context.Set<BasketItem>().Where(bi => bi.ProductId == productId && !bi.IsDeleted).ToListAsync();
            foreach (var item in basketItems)
            {
                item.IsDeleted = true;
            }

            await _context.SaveChangesAsync();
            _cache.Remove(CacheKeyAll);
            _cache.Remove(CacheKeyDetail(productId));

            // audit: Ürün silme logu
            await _auditLogService.LogAuditAsync(userId, "PRODUCT_DELETED", "Product", productId, $"ProductId: {productId}");
        }
    }
}