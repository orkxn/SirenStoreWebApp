using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SirenStore.Application.DTOs;
using SirenStore.Application.Interfaces;

namespace SirenStore.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        // Herkese Açık: Tüm aktif kategorileri listeler
        // GET: api/categories
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _categoryService.GetAllCategoriesAsync();
            return Ok(result);
        }

        // Herkese Açık: ID'ye göre tek bir kategori getirir
        // GET: api/categories/{id}
        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetById(long id)
        {
            var result = await _categoryService.GetCategoryByIdAsync(id);
            return Ok(result);
        }

        // Yeni Kategori Ekleme
        // POST: api/categories
        [HttpPost]
        [Authorize(Roles = "Admin")] // Sadece Admin rolü olan JWT token'lar erişebilir
        public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
        {
            var result = await _categoryService.CreateCategoryAsync(dto);
            // HTTP 201 Created dönerek kurumsal standarda uyuyoruz
            return StatusCode(201, result);
        }

        // Kategori Güncelleme
        // PUT: api/categories/{id}
        [HttpPut("{id:long}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(long id, [FromBody] UpdateCategoryDto dto)
        {
            var result = await _categoryService.UpdateCategoryAsync(id, dto);
            return Ok(result);
        }

        // Kategori Silme (Soft Delete)
        // DELETE: api/categories/{id}
        [HttpDelete("{id:long}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(long id)
        {
            await _categoryService.DeleteCategoryAsync(id);
            return Ok(new { message = "Kategori başarıyla silindi (Soft Delete)." });
        }
    }
}