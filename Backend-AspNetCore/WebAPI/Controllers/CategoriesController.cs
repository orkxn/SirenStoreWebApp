using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SirenStore.Application.DTOs;
using SirenStore.Application.Services;
using SirenStore.WebAPI.Extensions;

namespace SirenStore.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly CategoryService _categoryService;

        public CategoriesController(CategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        // tüm (aktif) kategorileri getirir
        // GET: api/categories
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _categoryService.GetAllCategoriesAsync();
            return Ok(result);
        }

        // belirli bir kategoriyi ID ile getirir
        // GET: api/categories/{id}
        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetById(long id)
        {
            var result = await _categoryService.GetCategoryByIdAsync(id);
            return Ok(result);
        }

        // yeni kategori oluşturma
        // POST: api/categories
        [HttpPost]
        [Authorize(Roles = "Admin")] // sadece adminler kategori oluşturabilir
        public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
        {
            var userId = User.GetUserId();
            var result = await _categoryService.CreateCategoryAsync(userId, dto);
            // sonucu 201 Created ile döndürür
            return StatusCode(201, result);
        }

        // kategori güncelleme
        // PUT: api/categories/{id}
        [HttpPut("{id:long}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(long id, [FromBody] UpdateCategoryDto dto)
        {
            var userId = User.GetUserId();
            var result = await _categoryService.UpdateCategoryAsync(userId, id, dto);
            return Ok(result);
        }

        // kategori silme (soft delete)
        // DELETE: api/categories/{id}
        [HttpDelete("{id:long}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(long id)
        {
            var userId = User.GetUserId();
            await _categoryService.DeleteCategoryAsync(userId, id);
            return Ok(new { message = "Kategori başarıyla silindi (Soft Delete)." });
        }
    }
}