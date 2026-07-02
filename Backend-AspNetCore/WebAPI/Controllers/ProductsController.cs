using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SirenStore.Application.DTOs;
using SirenStore.Application.Interfaces;
using SirenStore.WebAPI.Extensions;
using System.Security.Claims;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly IRepository<Entities.Models.Seller> _sellerRepository;
        private readonly IRepository<Entities.Models.User> _userRepository;

        public ProductsController(IProductService productService, IRepository<Entities.Models.Seller> sellerRepository, IRepository<Entities.Models.User> userRepository)
        {
            _productService = productService;
            _sellerRepository = sellerRepository;
            _userRepository = userRepository;
        }


        // tüm ürünleri listeleme
        // GET: api/products
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _productService.GetAllAsync();
            return Ok(products);
        }

        // id'ye göre ürün detayını getirme
        // GET: api/products/{id}
        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetById(long id)
        {
            var product = await _productService.GetByIdAsync(id);
            return Ok(product);
        }

        // belli bir kategorideki ürünleri listeleme
        // GET: api/products/category/{categoryId}
        [HttpGet("category/{categoryId:long}")]
        public async Task<IActionResult> GetByCategoryId(long categoryId)
        {
            var products = await _productService.GetByCategoryIdAsync(categoryId);
            return Ok(products);
        }

        // satıcıya özel ürünleri listeleme, sadece satıcı kendi ürünlerini görebilir
        // GET: api/products/my-products
        [Authorize(Roles = "Seller")]
        [HttpGet("my-products")]
        public async Task<IActionResult> GetMyProducts()
        {
            var userId = User.GetUserId();
            var products = await _productService.GetMyProductsAsync(userId);
            return Ok(products);
        }

        // yeni ürün oluşturma
        // POST: api/products
        [Authorize(Roles = "Seller")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
        {
            var userId = User.GetUserId();
            await _productService.CreateAsync(userId, dto);
            return StatusCode(201, new { message = "Ürün başarıyla oluşturuldu ve kataloğa eklendi." });
        }

        // ürün güncelleme
        // PUT: api/products
        [Authorize(Roles = "Seller")]
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateProductDto dto)
        {
            var userId = User.GetUserId();
            await _productService.UpdateAsync(userId, dto);
            return Ok(new { message = "Ürün ve görselleri başarıyla güncellendi." });
        }

        // ürün silme
        // DELETE: api/products/{id}
        [Authorize(Roles = "Seller")]
        [HttpDelete("{id:long}")]
        public async Task<IActionResult> Delete(long id)
        {
            var userId = User.GetUserId();
            await _productService.DeleteAsync(userId, id);
            return Ok(new { message = "Ürün başarıyla silindi." });
        }
    }
}