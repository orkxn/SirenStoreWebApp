using Application.DTOs.Comment;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentService _commentService;

        public CommentsController(ICommentService commentService)
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

        // ürüne yorum ekleme 
        // POST: api/comments
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CommentCreateDto dto)
        {
            var userId = GetUserIdFromToken();
            var result = await _commentService.CreateCommentAsync(dto, userId);
            return CreatedAtAction(nameof(GetByProductId), new { productId = result.ProductId }, result);
        }

        // ürün güncelleme
        // PUT: api/comments/{id}
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, [FromBody] CommentUpdateDto dto)
        {
            var userId = GetUserIdFromToken();
            var result = await _commentService.UpdateCommentAsync(id, dto, userId);
            return Ok(result);
        }

        // ürün silme
        // DELETE: api/comments/{id}
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var userId = GetUserIdFromToken();
            var isAdmin = User.IsInRole("Admin");
            await _commentService.DeleteCommentAsync(id, userId, isAdmin);
            return NoContent();
        }

        private long GetUserIdFromToken()
        {
            var nameIdentifier = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (long.TryParse(nameIdentifier, out long userId))
            {
                return userId;
            }
            throw new UnauthorizedAccessException();
        }
    }
}