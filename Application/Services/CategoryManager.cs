using Entities.Models;
using Microsoft.EntityFrameworkCore;
using SirenStore.Application.DTOs;
using SirenStore.Application.Interfaces;
using SirenStore.Application.Exceptions;

namespace SirenStore.Application.Services
{
    public class CategoryManager : ICategoryService
    {
        private readonly IRepository<Category> _categoryRepository;

        public CategoryManager(IRepository<Category> categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        // tüm kategorileri getir
        public async Task<List<CategoryDto>> GetAllCategoriesAsync()
        {
            return await _categoryRepository.AsQueryable()
                .Where(c => !c.IsDeleted)
                .Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name
                })
                .ToListAsync();
        }

        // id ile kategori getir
        public async Task<CategoryDto> GetCategoryByIdAsync(long id)
        {
            var categoryDto = await _categoryRepository.AsQueryable()
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
        public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto dto)
        {
            var exist = await _categoryRepository.GetAsync(c => c.Name.ToLower() == dto.Name.ToLower() && !c.IsDeleted);
            if (exist != null) throw new BusinessRuleException("Bu isimde bir kategori zaten mevcut.");

            var category = new Category { Name = dto.Name };
            await _categoryRepository.AddAsync(category);
            await _categoryRepository.SaveChangesAsync();

            return new CategoryDto { Id = category.Id, Name = category.Name };
        }

        // kategori güncelle
        public async Task<CategoryDto> UpdateCategoryAsync(long id, UpdateCategoryDto dto)
        {
            var category = await _categoryRepository.GetAsync(c => c.Id == id && !c.IsDeleted);
            if (category == null) throw new NotFoundException("Kategori bulunamadı.");

            category.Name = dto.Name;
            _categoryRepository.Update(category);
            await _categoryRepository.SaveChangesAsync();

            return new CategoryDto { Id = category.Id, Name = category.Name };
        }

        // kategori sil
        public async Task DeleteCategoryAsync(long id)
        {
            var category = await _categoryRepository.GetAsync(c => c.Id == id && !c.IsDeleted);
            if (category == null) throw new NotFoundException("Kategori bulunamadı.");

            category.IsDeleted = true;
            _categoryRepository.Update(category);
            await _categoryRepository.SaveChangesAsync();
        }
    }
}