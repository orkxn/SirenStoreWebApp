using Application.DTOs.Comment;
using AutoMapper;
using Entities.Models;
using Microsoft.EntityFrameworkCore;
using SirenStore.Application.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Services
{
    public class CommentManager : ICommentService
    {
        private readonly DbContext _context;
        private readonly IMapper _mapper;

        public CommentManager(DbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CommentDto>> GetCommentsByProductIdAsync(long productId)
        {
            var comments = await _context.Set<Comment>()
                .Include(c => c.User)
                .Where(c => c.ProductId == productId)
                .OrderByDescending(c => c.CreationDate)
                .ToListAsync();

            return _mapper.Map<IEnumerable<CommentDto>>(comments);
        }

        public async Task<CommentDto> CreateCommentAsync(CommentCreateDto dto, long userId)
        {
            var product = await _context.Set<Product>().FirstOrDefaultAsync(p => p.Id == dto.ProductId && !p.IsDeleted);
            if (product == null)
                throw new NotFoundException("Ürün bulunamadı.");

            // Satıcının kendi ürününe yorum yapmasını engelle
            var seller = await _context.Set<Seller>().FirstOrDefaultAsync(s => s.Id == product.SellerId && !s.IsDeleted);
            if (seller != null && seller.UserId == userId)
                throw new BusinessRuleException("Kendi sattığınız ürüne yorum yapamazsınız.");

            // aynı ürüne çift yorum kontrolü
            var alreadyCommented = await _context.Set<Comment>()
                .AnyAsync(c => c.ProductId == dto.ProductId && c.UserId == userId && !c.IsDeleted);
            if (alreadyCommented)
                throw new BusinessRuleException("Bu ürüne zaten yorum yaptınız.");

            var comment = _mapper.Map<Comment>(dto);
            comment.UserId = userId;
            comment.CreationDate = DateTime.UtcNow;
            comment.IsDeleted = false;

            await _context.Set<Comment>().AddAsync(comment);
            await _context.SaveChangesAsync();

            var savedComment = await _context.Set<Comment>()
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.Id == comment.Id);

            return _mapper.Map<CommentDto>(savedComment);
        }

        public async Task<CommentDto> UpdateCommentAsync(long commentId, CommentUpdateDto dto, long userId)
        {
            var comment = await _context.Set<Comment>()
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.Id == commentId);

            if (comment == null)
                throw new NotFoundException("Yorum", commentId);

            if (comment.UserId != userId)
                throw new UnauthorizedAccessException();

            comment.Text = dto.Text;
            comment.Rating = dto.Rating;
            comment.UpdatedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return _mapper.Map<CommentDto>(comment);
        }

        public async Task DeleteCommentAsync(long commentId, long userId, bool isAdmin = false)
        {
            var comment = await _context.Set<Comment>().FirstOrDefaultAsync(c => c.Id == commentId);

            if (comment == null)
                throw new NotFoundException("Yorum", commentId);

            if (comment.UserId != userId && !isAdmin)
                throw new UnauthorizedAccessException();

            comment.IsDeleted = true;
            comment.UpdatedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }
    }
}