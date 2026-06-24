using Microsoft.AspNetCore.Mvc;
using SirenStore.Application.DTOs;
using SirenStore.Application.Interfaces;

namespace SirenStore.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // İnternet adresi otomatik olarak: api/products olacak
    public class ProductsController(IProductService productService) : ControllerBase
    {
        // 1. GET: api/products (Tüm aktif ürünleri listeler)
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await productService.GetAllProductsAsync();
            return Ok(products); // HTTP 200 ile ürün listesini döner
        }

        // 2. GET: api/products/5 (ID'ye göre tek bir ürün getirir)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(long id)
        {
            var product = await productService.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound(new { Message = $"{id} numaralı aktif ürün bulunamadı." }); // HTTP 404
            }
            return Ok(product);
        }

        // 3. POST: api/products (Yeni ürün ekler)
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
        {
            try
            {
                // Bu metot tetiklendiğinde Manager içindeki FluentValidation mekanizman otomatik çalışacak
                await productService.CreateProductAsync(dto);
                return StatusCode(201, new { Message = "Ürün başarıyla eklendi." }); // HTTP 201 Created
            }
            catch (FluentValidation.ValidationException ex)
            {
                // Return HTTP 400 with validation errors
                return BadRequest(new { Errors = ex.Message });
            }
        }

        // 4. PUT: api/products/5/stock (Stok güncelleme iş mantığı)
        [HttpPut("{id}/stock")]
        public async Task<IActionResult> UpdateStock(long id, [FromQuery] int quantity)
        {
            await productService.UpdateStockAsync(id, quantity);
            return Ok(new { Message = "Stok durumu başarıyla güncellendi." });
        }

        // 5. DELETE: api/products/5 (Soft Delete)
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            await productService.DeleteProductAsync(id);
            return Ok(new { Message = "Ürün başarıyla satıştan kaldırıldı." });
        }
    }
}