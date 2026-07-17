using Application.DTOs.Comment;
using AutoMapper;
using Entities.Models;
using Entities.Enums;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using SirenStore.Application.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SirenStore.Application.Services
{
    public class CommentService
    {
        private readonly DbContext _context;
        private readonly IMapper _mapper;
        private readonly AuditLogService _auditLogService;
        private readonly IValidator<CommentCreateDto> _createValidator;
        private readonly IValidator<CommentUpdateDto> _updateValidator;
        private readonly IMemoryCache _cache;
        private static string CacheKeyProductComments(long productId) => $"Product_Comments_{productId}";

        public CommentService(
            DbContext context, 
            IMapper mapper, 
            AuditLogService auditLogService,
            IValidator<CommentCreateDto> createValidator,
            IValidator<CommentUpdateDto> updateValidator,
            IMemoryCache cache)
        {
            _context = context;
            _mapper = mapper;
            _auditLogService = auditLogService;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
            _cache = cache;
        }

        public async Task<IEnumerable<CommentDto>> GetCommentsByProductIdAsync(long productId)
        {
            var key = CacheKeyProductComments(productId);
            if (!_cache.TryGetValue(key, out IEnumerable<CommentDto> mappedComments))
            {
                var comments = await _context.Set<Comment>()
                    .Include(c => c.User)
                    .Where(c => c.ProductId == productId)
                    .OrderByDescending(c => c.CreationDate)
                    .ToListAsync();

                mappedComments = _mapper.Map<IEnumerable<CommentDto>>(comments);

                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(TimeSpan.FromMinutes(20))
                    .SetSlidingExpiration(TimeSpan.FromMinutes(3));

                _cache.Set(key, mappedComments, cacheEntryOptions);
            }
            return mappedComments;
        }

        public async Task<IEnumerable<CommentDto>> GetCommentsByUserIdAsync(long userId)
        {
            var comments = await _context.Set<Comment>()
                .Include(c => c.User)
                .Include(c => c.Product)
                    .ThenInclude(p => p.ProductImages)
                .Where(c => c.UserId == userId && !c.IsDeleted)
                .OrderByDescending(c => c.CreationDate)
                .ToListAsync();

            return _mapper.Map<IEnumerable<CommentDto>>(comments);
        }

        public async Task<bool> CanUserCommentOnProductAsync(long userId, long productId)
        {
            var product = await _context.Set<Product>().FirstOrDefaultAsync(p => p.Id == productId && !p.IsDeleted);
            if (product == null) return false;

            // Satıcının kendi ürününe yorum yapmasını engelle
            var seller = await _context.Set<Seller>().FirstOrDefaultAsync(s => s.Id == product.SellerId && !s.IsDeleted);
            if (seller != null && seller.UserId == userId) return false;

            // aynı ürüne çift yorum kontrolü
            var alreadyCommented = await _context.Set<Comment>()
                .AnyAsync(c => c.ProductId == productId && c.UserId == userId && !c.IsDeleted);
            if (alreadyCommented) return false;

            // Yalnızca ürünü satın alan ve teslim alan kişiler yorum yapabilir
            var hasDeliveredOrder = await _context.Set<OrderItem>()
                .AnyAsync(oi => oi.ProductId == productId 
                                && oi.Order.UserId == userId 
                                && (oi.Status == OrderStatus.Delivered || oi.Order.Status == OrderStatus.Delivered)
                                && !oi.IsDeleted 
                                && !oi.Order.IsDeleted);

            return hasDeliveredOrder;
        }

        public async Task<CommentDto> CreateCommentAsync(CommentCreateDto dto, long userId)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

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

            // Satın alma ve teslimat kontrolü
            var canComment = await CanUserCommentOnProductAsync(userId, dto.ProductId);
            if (!canComment)
                throw new BusinessRuleException("Yalnızca satın aldığınız ve teslim edilen ürünlere yorum yapabilirsiniz.");

            var comment = _mapper.Map<Comment>(dto);
            comment.UserId = userId;
            comment.CreationDate = DateTime.UtcNow;
            comment.IsDeleted = false;

            await _context.Set<Comment>().AddAsync(comment);
            await _context.SaveChangesAsync();
            _cache.Remove(CacheKeyProductComments(comment.ProductId));

            // audit: Yorum oluşturma logu
            await _auditLogService.LogAuditAsync(userId, "COMMENT_CREATED", "Comment", comment.Id, $"Rating: {comment.Rating}");

            var savedComment = await _context.Set<Comment>()
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.Id == comment.Id);

            return _mapper.Map<CommentDto>(savedComment);
        }

        public async Task<CommentDto> UpdateCommentAsync(long commentId, CommentUpdateDto dto, long userId)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

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
            _cache.Remove(CacheKeyProductComments(comment.ProductId));

            // audit: Yorum güncelleme logu
            await _auditLogService.LogAuditAsync(userId, "COMMENT_UPDATED", "Comment", comment.Id, $"NewRating: {comment.Rating}");

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
            _cache.Remove(CacheKeyProductComments(comment.ProductId));

            // audit: Yorum silme logu
            await _auditLogService.LogAuditAsync(userId, "COMMENT_DELETED", "Comment", commentId, $"IsAdmin: {isAdmin}");
        }
    }
}