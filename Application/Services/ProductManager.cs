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
        IMapper mapper,
        IValidator<CreateProductDto> createProductValidator) : IProductService
    {
        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
        {
            // İş mantığı: Sadece aktif ürünleri DB seviyesinde filtreleyerek çekiyoruz
            var activeProducts = await productRepository.GetAllAsync(p => p.IsActive);
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
            var validationResult = await createProductValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                var errors = string.Join(" | ", validationResult.Errors.Select(e => e.ErrorMessage));
                throw new ValidationException(errors);
            }

            var product = mapper.Map<Product>(dto);
            product.IsActive = true; // Ürün ilk eklendiğinde doğrudan satışa çıksın

            await productRepository.AddAsync(product);
            await productRepository.SaveChangesAsync();
        }

        public async Task UpdateStockAsync(long productId, int quantity)
        {
            var product = await productRepository.GetByIdAsync(productId);
            if (product == null) throw new NotFoundException("Ürün", productId);

            // İş mantığı: Stok kontrolü
            if (product.Stock + quantity < 0)
                throw new BusinessRuleException("Yetersiz stok! Mevcut stoktan daha fazla düşüm yapılamaz.");

            product.Stock += quantity;
            productRepository.Update(product);
            await productRepository.SaveChangesAsync();
        }
    }
}