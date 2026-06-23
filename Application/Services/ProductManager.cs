using AutoMapper;
using Entities.Models;
using SirenStore.Application.DTOs;
using SirenStore.Application.Interfaces;

namespace SirenStore.Application.Services
{
    public class ProductManager(IRepository<Product> productRepository, IMapper mapper) : IProductService
    {
        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
        {
            var products = await productRepository.GetAllAsync();
            // İş mantığı: Sadece aktif olan ürünleri Angular'a dönmek isteyebiliriz
            var activeProducts = products.Where(p => p.IsActive);
            return mapper.Map<IEnumerable<ProductDto>>(activeProducts);
        }

        public async Task<ProductDto?> GetProductByIdAsync(long id)
        {
            var product = await productRepository.GetByIdAsync(id);
            if (product == null || !product.IsActive) return null;

            return mapper.Map<ProductDto>(product);
        }

        public async Task CreateProductAsync(CreateProductDto dto)
        {
            // İş mantığı: Fiyat 0 veya negatif olamaz kontrolü (Validasyon)
            if (dto.Price <= 0) throw new Exception("Ürün fiyatı 0 veya daha az olamaz!");

            var product = mapper.Map<Product>(dto);
            product.IsActive = true; // Ürün ilk eklendiğinde doğrudan satışa çıksın

            await productRepository.AddAsync(product);
            await productRepository.SaveChangesAsync();
        }

        public async Task UpdateStockAsync(long productId, int quantity)
        {
            var product = await productRepository.GetByIdAsync(productId);
            if (product == null) throw new Exception("Ürün bulunamadı!");

            // İş mantığı: Stok kontrolü
            if (product.Stock + quantity < 0)
                throw new Exception("Yetersiz stok! Mevcut stoktan daha fazla düşüm yapılamaz.");

            product.Stock += quantity;
            productRepository.Update(product);
            await productRepository.SaveChangesAsync();
        }
    }
}