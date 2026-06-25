using Entities.Models;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using SirenStore.Application.DTOs;
using SirenStore.Application.Exceptions;
using SirenStore.Application.Interfaces;

namespace SirenStore.Application.Services
{
    public class ProductManager : IProductService
    {
        private readonly IRepository<Product> _productRepository;
        private readonly IRepository<Seller> _sellerRepository;
        private readonly IRepository<Category> _categoryRepository;
        private readonly IValidator<CreateProductDto> _createValidator;
        private readonly IValidator<UpdateProductDto> _updateValidator;

        public ProductManager(
            IRepository<Product> productRepository,
            IRepository<Seller> sellerRepository,
            IRepository<Category> categoryRepository,
            IValidator<CreateProductDto> createValidator,
            IValidator<UpdateProductDto> updateValidator)
        {
            _productRepository = productRepository;
            _sellerRepository = sellerRepository;
            _categoryRepository = categoryRepository;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        // 1. TÜM ÜRÜNLERİ LİSTELE (IQueryable & Projeksiyon Avantajı)
        public async Task<IEnumerable<ProductListDto>> GetAllAsync()
        {
            return await _productRepository.AsQueryable()
                .Include(p => p.Category)
                .Include(p => p.Seller)
                .Include(p => p.ProductImages)
                // Select ile sadece DTO'ya lazım olan kolonları SQL seviyesinde çekiyoruz
                .Select(p => new ProductListDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    CategoryName = p.Category.Name,
                    StoreName = p.Seller.StoreName,
                    // Ana resmi bul, yoksa ilk resmi al, o da yoksa null dön
                    MainImageUrl = p.ProductImages.FirstOrDefault(img => img.IsMain).ImageUrl
                                   ?? p.ProductImages.FirstOrDefault().ImageUrl
                })
                .ToListAsync();
        }

        // 2. KATEGORİYE GÖRE LİSTELE
        public async Task<IEnumerable<ProductListDto>> GetByCategoryIdAsync(long categoryId)
        {
            // Önce kategori var mı kontrolü
            var categoryExists = await _categoryRepository.AsQueryable().AnyAsync(c => c.Id == categoryId);
            if (!categoryExists)
                throw new NotFoundException("Belirtilen kategori bulunamadı.");

            return await _productRepository.AsQueryable()
                .Where(p => p.CategoryId == categoryId)
                .Include(p => p.Category)
                .Include(p => p.Seller)
                .Include(p => p.ProductImages)
                .Select(p => new ProductListDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    CategoryName = p.Category.Name,
                    StoreName = p.Seller.StoreName,
                    MainImageUrl = p.ProductImages.FirstOrDefault(img => img.IsMain).ImageUrl
                                   ?? p.ProductImages.FirstOrDefault().ImageUrl
                })
                .ToListAsync();
        }

        // 3. ÜRÜN DETAYI GETİR
        public async Task<ProductListDto> GetByIdAsync(long id)
        {
            var productDto = await _productRepository.AsQueryable()
                .Where(p => p.Id == id)
                .Include(p => p.Category)
                .Include(p => p.Seller)
                .Include(p => p.ProductImages)
                .Select(p => new ProductListDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    CategoryName = p.Category.Name,
                    StoreName = p.Seller.StoreName,
                    MainImageUrl = p.ProductImages.FirstOrDefault(img => img.IsMain).ImageUrl
                                   ?? p.ProductImages.FirstOrDefault().ImageUrl
                })
                .FirstOrDefaultAsync();

            if (productDto == null)
                throw new NotFoundException("Ürün bulunamadı.");

            return productDto;
        }

        // 4. ÜRÜN EKLE
        public async Task CreateAsync(long userId, CreateProductDto dto)
        {
            // Kapıda doğrula
            await _createValidator.ValidateAndThrowAsync(dto);

            // Bu işlemi yapmaya çalışan kullanıcının aktif bir satıcı kaydı var mı?
            var seller = await _sellerRepository.GetAsync(s => s.UserId == userId);
            if (seller == null || seller.Status != Entities.Enums.SellerStatus.Approved)
                throw new BusinessRuleException("Sadece onaylanmış mağazalar ürün ekleyebilir.");

            // Kategori kontrolü
            var categoryExists = await _categoryRepository.AsQueryable().AnyAsync(c => c.Id == dto.CategoryId);
            if (!categoryExists)
                throw new NotFoundException("Seçilen kategori geçerli değil.");

            var newProduct = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                Stock = dto.Stock,
                CategoryId = dto.CategoryId,
                SellerId = seller.Id // Token'dan bulduğumuz güvenli mağaza ID'si
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

            await _productRepository.AddAsync(newProduct);
            await _productRepository.SaveChangesAsync();
        }

        // 5. ÜRÜN GÜNCELLE (IDOR Korumalı)
        public async Task UpdateAsync(long userId, UpdateProductDto dto)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

            // İşlemi yapan kişinin mağazasını bul
            var seller = await _sellerRepository.GetAsync(s => s.UserId == userId);
            if (seller == null)
                throw new BusinessRuleException("Satıcı profili bulunamadı.");

            // Güncellenmek istenen ürünü getir
            var product = await _productRepository.GetAsync(p => p.Id == dto.Id);
            if (product == null)
                throw new NotFoundException("Güncellenmek istenen ürün bulunamadı.");

            // IDOR GÜVENLİK DUVARI: Bu ürün gerçekten bu satıcıya mı ait?
            if (product.SellerId != seller.Id)
                throw new BusinessRuleException("Bu ürünü güncelleme yetkiniz bulunmamaktadır!");

            // Kategori kontrolü
            var categoryExists = await _categoryRepository.AsQueryable().AnyAsync(c => c.Id == dto.CategoryId);
            if (!categoryExists)
                throw new NotFoundException("Seçilen kategori geçerli değil.");

            // Güncelleme lojiği
            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.Stock = dto.Stock;
            product.CategoryId = dto.CategoryId;

            product.ProductImages.Clear();

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

            _productRepository.Update(product);
            await _productRepository.SaveChangesAsync();
        }

        // 6. ÜRÜN SİL (Soft Delete & IDOR Korumalı)
        public async Task DeleteAsync(long userId, long productId)
        {
            var seller = await _sellerRepository.GetAsync(s => s.UserId == userId);
            if (seller == null)
                throw new BusinessRuleException("Satıcı profili bulunamadı.");

            var product = await _productRepository.GetAsync(p => p.Id == productId);
            if (product == null)
                throw new NotFoundException("Silinmek istenen ürün bulunamadı.");

            // IDOR GÜVENLİK DUVARI
            if (product.SellerId != seller.Id)
                throw new BusinessRuleException("Bu ürünü silme yetkiniz bulunmamaktadır!");

            
            product.IsDeleted = true;

            _productRepository.Update(product);
            await _productRepository.SaveChangesAsync();
        }
    }
}