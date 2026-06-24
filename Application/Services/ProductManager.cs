using AutoMapper;
using Entities.Models;
using FluentValidation;
using SirenStore.Application.DTOs;
using SirenStore.Application.Exceptions;
using SirenStore.Application.Interfaces;

namespace SirenStore.Application.Services
{
    public class ProductManager(
        IRepository<Product> productRepository,
        IRepository<Category> categoryRepository,
        IMapper mapper,
        IValidator<CreateProductDto> createProductValidator) : IProductService
    {
        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
        {
            // İş mantığı: Sadece aktif ürünleri DB seviyesinde filtreleyerek çekiyoruz
            var activeProducts = await productRepository.GetAllAsync(p => p.IsActive);
            return mapper.Map<IEnumerable<ProductDto>>(activeProducts);
        }

        public async Task<ProductDto> GetProductByIdAsync(long id)
        {
            var product = await productRepository.GetByIdAsync(id);
            if (product == null || !product.IsActive)
                throw new NotFoundException("Ürün", id);

            return mapper.Map<ProductDto>(product);
        }

        public async Task CreateProductAsync(CreateProductDto dto)
        {
            await createProductValidator.ValidateAndThrowAsync(dto);

            // Category existence is validated by FluentValidation (CreateProductValidator)
            // so no need to check it again here to avoid duplicate DB calls.

            var product = mapper.Map<Product>(dto);
            product.IsActive = true; // Ürün ilk eklendiğinde doğrudan satışa çıksın

            await productRepository.AddAsync(product);
            await productRepository.SaveChangesAsync();
        }

        public async Task UpdateStockAsync(long productId, int quantity)
        {
            var product = await productRepository.GetByIdAsync(productId);
            if (product == null || !product.IsActive || product.IsDeleted) throw new NotFoundException("Ürün", productId);

            // İş mantığı: Stok kontrolü
            if (quantity < 0)
                throw new BusinessRuleException("Yeni stok sayınız geçersiz!");

            product.Stock = quantity;
            productRepository.Update(product);
            await productRepository.SaveChangesAsync();
        }

        public async Task ToggleProductStatusAsync(long productId)
        {
            var product = await productRepository.GetByIdAsync(productId);

            if (product == null || product.IsDeleted)
                throw new NotFoundException("Ürün", productId);

            product.IsActive = !product.IsActive;

            productRepository.Update(product);
            await productRepository.SaveChangesAsync();
        }

    }
}
