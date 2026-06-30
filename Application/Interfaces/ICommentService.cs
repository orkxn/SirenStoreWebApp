using Application.DTOs.Comment;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Services
{
    public interface ICommentService
    {
        Task<IEnumerable<CommentDto>> GetCommentsByProductIdAsync(long productId);
        Task<CommentDto> CreateCommentAsync(CommentCreateDto dto, long userId);
        Task<CommentDto> UpdateCommentAsync(long commentId, CommentUpdateDto dto, long userId);
        Task DeleteCommentAsync(long commentId, long userId, bool isAdmin = false);
    }
}