using System.Security.Claims;

namespace SirenStore.WebAPI.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static long GetUserId(this ClaimsPrincipal principal)
        {
            var claim = principal.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null || string.IsNullOrEmpty(claim.Value) || !long.TryParse(claim.Value, out long userId))
            {
                throw new UnauthorizedAccessException("Geçersiz kullanıcı kimliği.");
            }
            return userId;
        }
    }
}
