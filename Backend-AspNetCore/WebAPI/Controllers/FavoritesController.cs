using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SirenStore.Application.Interfaces;
using SirenStore.WebAPI.Extensions;
using System.Security.Claims;

namespace SirenStore.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FavoritesController : ControllerBase
    {
        private readonly IFavoriteService _favoriteService;

        public FavoritesController(IFavoriteService favoriteService)
        {
            _favoriteService = favoriteService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyFavorites()
        {
            var userId = User.GetUserId();
            var favorites = await _favoriteService.GetFavoritesAsync(userId);
            return Ok(favorites);
        }

        [HttpGet("ids")]
        public async Task<IActionResult> GetMyFavoriteIds()
        {
            var userId = User.GetUserId();
            var ids = await _favoriteService.GetFavoriteProductIdsAsync(userId);
            return Ok(ids);
        }

        [HttpPost("{productId:long}")]
        public async Task<IActionResult> AddToFavorites(long productId)
        {
            var userId = User.GetUserId();
            await _favoriteService.AddToFavoritesAsync(userId, productId);
            return Ok(new { message = "Ürün favorilerinize eklendi." });
        }

        [HttpDelete("{productId:long}")]
        public async Task<IActionResult> RemoveFromFavorites(long productId)
        {
            var userId = User.GetUserId();
            await _favoriteService.RemoveFromFavoritesAsync(userId, productId);
            return Ok(new { message = "Ürün favorilerinizden çıkarıldı." });
        }
    }
}
