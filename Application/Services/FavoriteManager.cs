using Entities.Models;
using Microsoft.EntityFrameworkCore;
using SirenStore.Application.DTOs;
using SirenStore.Application.Exceptions;
using SirenStore.Application.Interfaces;

namespace SirenStore.Application.Services
{
    public class FavoriteManager : IFavoriteService
    {
        private readonly IRepository<Favorite> _favoriteRepository;
        private readonly IRepository<Product> _productRepository;
        private readonly IAuditLogService _auditLogService;

        public FavoriteManager(
            IRepository<Favorite> favoriteRepository,
            IRepository<Product> productRepository,
            IAuditLogService auditLogService)
        {
            _favoriteRepository = favoriteRepository;
            _productRepository = productRepository;
            _auditLogService = auditLogService;
        }

        public async Task AddToFavoritesAsync(long userId, long productId)
        {
            var product = await _productRepository.GetByIdAsync(productId);
            if (product == null)
                throw new NotFoundException("Ürün bulunamadı.");

            var exists = await _favoriteRepository.AnyAsync(f => f.UserId == userId && f.ProductId == productId);
            if (exists) return; // Zaten favorilerde ise hata vermeden dön

            var favorite = new Favorite
            {
                UserId = userId,
                ProductId = productId
            };

            await _favoriteRepository.AddAsync(favorite);
            await _favoriteRepository.SaveChangesAsync();

            await _auditLogService.LogAuditAsync(userId, "PRODUCT_FAVORITED", "Product", productId, $"ProductId: {productId}");
        }

        public async Task RemoveFromFavoritesAsync(long userId, long productId)
        {
            var favorite = await _favoriteRepository.GetAsync(f => f.UserId == userId && f.ProductId == productId);
            if (favorite != null)
            {
                _favoriteRepository.Remove(favorite);
                await _favoriteRepository.SaveChangesAsync();

                await _auditLogService.LogAuditAsync(userId, "PRODUCT_UNFAVORITED", "Product", productId, $"ProductId: {productId}");
            }
        }

        public async Task<List<ProductListDto>> GetFavoritesAsync(long userId)
        {
            return await _favoriteRepository.AsQueryable()
                .Where(f => f.UserId == userId && f.Product != null && !f.Product.IsDeleted)
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
            return await _favoriteRepository.AsQueryable()
                .Where(f => f.UserId == userId)
                .Select(f => f.ProductId)
                .ToListAsync();
        }
    }
}
