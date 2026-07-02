using Entities.Models;
using Microsoft.EntityFrameworkCore;
using SirenStore.Application.DTOs;
using SirenStore.Application.Exceptions;

namespace SirenStore.Application.Services
{
    public class FavoriteService
    {
        private readonly DbContext _context;
        private readonly AuditLogService _auditLogService;

        public FavoriteService(
            DbContext context,
            AuditLogService auditLogService)
        {
            _context = context;
            _auditLogService = auditLogService;
        }

        public async Task AddToFavoritesAsync(long userId, long productId)
        {
            var product = await _context.Set<Product>().FirstOrDefaultAsync(p => p.Id == productId && !p.IsDeleted);
            if (product == null)
                throw new NotFoundException("Ürün bulunamadı.");

            var exists = await _context.Set<Favorite>().AnyAsync(f => f.UserId == userId && f.ProductId == productId && !f.IsDeleted);
            if (exists) return; // Zaten favorilerde ise hata vermeden dön

            var favorite = new Favorite
            {
                UserId = userId,
                ProductId = productId
            };

            await _context.Set<Favorite>().AddAsync(favorite);
            await _context.SaveChangesAsync();

            await _auditLogService.LogAuditAsync(userId, "PRODUCT_FAVORITED", "Product", productId, $"ProductId: {productId}");
        }

        public async Task RemoveFromFavoritesAsync(long userId, long productId)
        {
            var favorite = await _context.Set<Favorite>().FirstOrDefaultAsync(f => f.UserId == userId && f.ProductId == productId && !f.IsDeleted);
            if (favorite != null)
            {
                favorite.IsDeleted = true;
                await _context.SaveChangesAsync();

                await _auditLogService.LogAuditAsync(userId, "PRODUCT_UNFAVORITED", "Product", productId, $"ProductId: {productId}");
            }
        }

        public async Task<List<ProductListDto>> GetFavoritesAsync(long userId)
        {
            return await _context.Set<Favorite>()
                .Where(f => f.UserId == userId && !f.IsDeleted && f.Product != null && !f.Product.IsDeleted)
                .OrderByDescending(f => f.CreationDate)
                .Select(f => new ProductListDto
                {
                    Id = f.Product!.Id,
                    Name = f.Product.Name,
                    Description = f.Product.Description,
                    Price = f.Product.Price,
                    Stock = f.Product.Stock,
                    CategoryId = f.Product.CategoryId,
                    CategoryName = f.Product.Category != null ? f.Product.Category.Name : string.Empty,
                    SellerId = f.Product.SellerId,
                    StoreName = f.Product.Seller != null ? f.Product.Seller.StoreName : string.Empty,
                    MainImageUrl = f.Product.ProductImages.Where(img => img.IsMain).Select(img => img.ImageUrl).FirstOrDefault()
                                  ?? f.Product.ProductImages.Select(img => img.ImageUrl).FirstOrDefault()
                })
                .ToListAsync();
        }

        public async Task<List<long>> GetFavoriteProductIdsAsync(long userId)
        {
            return await _context.Set<Favorite>()
                .Where(f => f.UserId == userId && !f.IsDeleted)
                .Select(f => f.ProductId)
                .ToListAsync();
        }
    }
}
