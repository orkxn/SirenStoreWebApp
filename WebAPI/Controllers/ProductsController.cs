using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SirenStore.Application.DTOs;
using SirenStore.Application.Interfaces;
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


        // 1. HERKESE AÇIK: Tüm Ürünleri Listele
        // GET: api/products
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _productService.GetAllAsync();
            return Ok(products);
        }

        // 2. HERKESE AÇIK: ID'ye Göre Ürün Detayı Getir
        // GET: api/products/{id}
        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetById(long id)
        {
            var product = await _productService.GetByIdAsync(id);
            return Ok(product);
        }

        // 3. HERKESE AÇIK: Kategoriye Göre Ürünleri Filtrele
        // GET: api/products/category/{categoryId}
        [HttpGet("category/{categoryId:long}")]
        public async Task<IActionResult> GetByCategoryId(long categoryId)
        {
            var products = await _productService.GetByCategoryIdAsync(categoryId);
            return Ok(products);
        }

        // 3.5 SATICIYA ÖZEL: Kendi Ürünlerini Getir
        // GET: api/products/my-products
        [Authorize(Roles = "Seller")]
        [HttpGet("my-products")]
        public async Task<IActionResult> GetMyProducts()
        {
            var userId = GetUserIdFromToken();
            var products = await _productService.GetMyProductsAsync(userId);
            return Ok(products);
        }

        // 4. SATICIYA ÖZEL: Yeni Ürün Ekle
        // POST: api/products
        [Authorize(Roles = "Seller")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
        {
            var userId = GetUserIdFromToken();
            await _productService.CreateAsync(userId, dto);
            return StatusCode(201, new { message = "Ürün başarıyla oluşturuldu ve kataloğa eklendi." });
        }

        // 5. SATICIYA ÖZEL: Ürün Güncelle (IDOR Korumalı)
        // PUT: api/products
        [Authorize(Roles = "Seller")]
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateProductDto dto)
        {
            var userId = GetUserIdFromToken();
            await _productService.UpdateAsync(userId, dto);
            return Ok(new { message = "Ürün ve görselleri başarıyla güncellendi." });
        }

        // 6. SATICIYA ÖZEL: Ürün Sil (Soft-Delete & IDOR Korumalı)
        // DELETE: api/products/{id}
        [Authorize(Roles = "Seller")]
        [HttpDelete("{id:long}")]
        public async Task<IActionResult> Delete(long id)
        {
            var userId = GetUserIdFromToken();
            await _productService.DeleteAsync(userId, id);
            return Ok(new { message = "Ürün başarıyla silindi." });
        }

        // JWT Token'dan Güvenli Şekilde NameIdentifier (UserId) Çeken Yardımcı Metot
        private long GetUserIdFromToken()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                throw new UnauthorizedAccessException("Geçerli bir kullanıcı kimliği bulunamadı.");

            return long.Parse(userIdClaim.Value);
        }
    }
}