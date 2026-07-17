using Application.DTOs.Comment;
using SirenStore.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SirenStore.WebAPI.Extensions;
using System.Security.Claims;
using System.Threading.Tasks;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly CommentService _commentService;

        public CommentsController(CommentService commentService)
        {
            _commentService = commentService;
        }

        // ürünü getirme 
        // GET: api/comments/product/{productid}
        [HttpGet("product/{productId}")]
        public async Task<IActionResult> GetByProductId(long productId)
        {
            var comments = await _commentService.GetCommentsByProductIdAsync(productId);
            return Ok(comments);
        }

        // kullanıcının yorumlarını getirme
        // GET: api/comments/my-comments
        [Authorize]
        [HttpGet("my-comments")]
        public async Task<IActionResult> GetMyComments()
        {
            var userId = User.GetUserId();
            var comments = await _commentService.GetCommentsByUserIdAsync(userId);
            return Ok(comments);
        }

        // yorum yapabilme uygunluğunu kontrol etme
        // GET: api/comments/eligibility/{productId}
        [Authorize]
        [HttpGet("eligibility/{productId}")]
        public async Task<IActionResult> CheckEligibility(long productId)
        {
            var userId = User.GetUserId();
            var isEligible = await _commentService.CanUserCommentOnProductAsync(userId, productId);
            return Ok(new { isEligible });
        }

        // ürüne yorum ekleme 
        // POST: api/comments
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CommentCreateDto dto)
        {
            var userId = User.GetUserId();
            var result = await _commentService.CreateCommentAsync(dto, userId);
            return CreatedAtAction(nameof(GetByProductId), new { productId = result.ProductId }, result);
        }

        // ürün güncelleme
        // PUT: api/comments/{id}
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, [FromBody] CommentUpdateDto dto)
        {
            var userId = User.GetUserId();
            var result = await _commentService.UpdateCommentAsync(id, dto, userId);
            return Ok(result);
        }

        // ürün silme
        // DELETE: api/comments/{id}
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var userId = User.GetUserId();
            var isAdmin = User.IsInRole("Admin");
            await _commentService.DeleteCommentAsync(id, userId, isAdmin);
            return NoContent();
        }
    }
}