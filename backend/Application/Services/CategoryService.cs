using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using SirenStore.Application.DTOs;
using SirenStore.Application.Exceptions;

namespace SirenStore.Application.Services
{
    public class CategoryService
    {
        private readonly DbContext _context;
        private readonly AuditLogService _auditLogService;
        private readonly IMemoryCache _cache;
        private const string CacheKey = "Categories_All";

        public CategoryService(DbContext context, AuditLogService auditLogService, IMemoryCache cache)
        {
            _context = context;
            _auditLogService = auditLogService;
            _cache = cache;
        }

        // tüm kategorileri getir
        public async Task<List<CategoryDto>> GetAllCategoriesAsync()
        {
            if (!_cache.TryGetValue(CacheKey, out List<CategoryDto> categories))
            {
                categories = await _context.Set<Category>()
                    .Where(c => !c.IsDeleted)
                    .Select(c => new CategoryDto
                    {
                        Id = c.Id,
                        Name = c.Name
                    })
                    .ToListAsync();

                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(TimeSpan.FromHours(1))
                    .SetSlidingExpiration(TimeSpan.FromMinutes(10));

                _cache.Set(CacheKey, categories, cacheEntryOptions);
            }
            return categories;
        }

        // id ile kategori getir
        public async Task<CategoryDto> GetCategoryByIdAsync(long id)
        {
            var categoryDto = await _context.Set<Category>()
                .Where(c => c.Id == id && !c.IsDeleted)
                .Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name
                })
                .FirstOrDefaultAsync();

            if (categoryDto == null)
                throw new NotFoundException("Kategori bulunamadı.");

            return categoryDto;
        }

        // kategori oluştur
        public async Task<CategoryDto> CreateCategoryAsync(long userId, CreateCategoryDto dto)
        {
            var exist = await _context.Set<Category>().FirstOrDefaultAsync(c => c.Name.ToLower() == dto.Name.ToLower() && !c.IsDeleted);
            if (exist != null) throw new BusinessRuleException("Bu isimde bir kategori zaten mevcut.");

            var category = new Category { Name = dto.Name };
            await _context.Set<Category>().AddAsync(category);
            await _context.SaveChangesAsync();
            _cache.Remove(CacheKey);

            // audit: Kategori oluşturma logu
            await _auditLogService.LogAuditAsync(userId, "CATEGORY_CREATED", "Category", category.Id, $"Name: {category.Name}");

            return new CategoryDto { Id = category.Id, Name = category.Name };
        }

        // kategori güncelle
        public async Task<CategoryDto> UpdateCategoryAsync(long userId, long id, CreateCategoryDto dto)
        {
            var category = await _context.Set<Category>().FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);
            if (category == null) throw new NotFoundException("Kategori bulunamadı.");

            category.Name = dto.Name;
            await _context.SaveChangesAsync();
            _cache.Remove(CacheKey);

            // audit: Kategori güncelleme logu
            await _auditLogService.LogAuditAsync(userId, "CATEGORY_UPDATED", "Category", category.Id, $"NewName: {category.Name}");

            return new CategoryDto { Id = category.Id, Name = category.Name };
        }

        // kategori sil
        public async Task DeleteCategoryAsync(long userId, long id)
        {
            var category = await _context.Set<Category>().FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);
            if (category == null) throw new NotFoundException("Kategori bulunamadı.");

            category.IsDeleted = true;
            await _context.SaveChangesAsync();
            _cache.Remove(CacheKey);

            // audit: Kategori silme logu
            await _auditLogService.LogAuditAsync(userId, "CATEGORY_DELETED", "Category", id, $"Name: {category.Name}");
        }
    }
}