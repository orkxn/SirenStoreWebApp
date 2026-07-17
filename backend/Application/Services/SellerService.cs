using Microsoft.EntityFrameworkCore;
using Entities.Enums;
using Entities.Models;
using FluentValidation;
using SirenStore.Application.DTOs;
using SirenStore.Application.Exceptions;

namespace SirenStore.Application.Services
{
    public class SellerService
    {
        private readonly DbContext _context;
        private readonly IValidator<CreateSellerDto> _validator;
        private readonly AuditLogService _auditLogService;

        public SellerService(
            DbContext context,
            IValidator<CreateSellerDto> validator,
            AuditLogService auditLogService)
        {
            _context = context;
            _validator = validator;
            _auditLogService = auditLogService;
        }

        // satıcı başvuru mekanizması
        public async Task BecomeSellerAsync(long userId, CreateSellerDto dto)
        {
            await _validator.ValidateAndThrowAsync(dto);

            var user = await _context.Set<User>().FirstOrDefaultAsync(u => u.Id == userId && !u.IsDeleted);
            if (user == null)
                throw new NotFoundException("Kullanıcı bulunamadı.");

            var existingSeller = await _context.Set<Seller>().FirstOrDefaultAsync(s => s.UserId == userId && !s.IsDeleted);
            if (existingSeller != null)
            {
                if (existingSeller.Status == SellerStatus.Pending)
                    throw new BusinessRuleException("Zaten bekleyen bir satıcı başvurunuz var. Lütfen yöneticinin onaylamasını bekleyin.");
                
                if (existingSeller.Status == SellerStatus.Approved)
                    throw new BusinessRuleException("Zaten onaylı bir mağazanız var.");

                existingSeller.StoreName = dto.StoreName;
                existingSeller.ContactEmail = dto.ContactEmail;
                existingSeller.ContactPhone = dto.ContactPhone;
                existingSeller.SupportLine = dto.SupportLine;
                existingSeller.TaxNumber = dto.TaxNumber;
                existingSeller.TaxOffice = dto.TaxOffice;
                existingSeller.Status = SellerStatus.Pending;

                await _context.SaveChangesAsync();
                await _auditLogService.LogAuditAsync(userId, "SELLER_APPLICATION_SUBMITTED", "Seller", existingSeller.Id, $"StoreName: {dto.StoreName} (Updated)");
                return;
            }

            var newSeller = new Seller
            {
                UserId = userId,
                StoreName = dto.StoreName,
                ContactEmail = dto.ContactEmail,
                ContactPhone = dto.ContactPhone,
                SupportLine = dto.SupportLine,
                TaxNumber = dto.TaxNumber,
                TaxOffice = dto.TaxOffice,
                Status = SellerStatus.Pending
            };

            await _context.Set<Seller>().AddAsync(newSeller);
            await _context.SaveChangesAsync();
            await _auditLogService.LogAuditAsync(userId, "SELLER_APPLICATION_SUBMITTED", "Seller", newSeller.Id, $"StoreName: {dto.StoreName}");
        }

        // admin onay mekanizması
        public async Task ApproveSellerAsync(long sellerId)
        {
            var seller = await _context.Set<Seller>().FirstOrDefaultAsync(s => s.Id == sellerId && !s.IsDeleted);
            if (seller == null)
                throw new NotFoundException("Satıcı başvurusu bulunamadı.");

            if (seller.Status == SellerStatus.Approved)
                throw new BusinessRuleException("Bu başvuru zaten onaylanmış.");

            seller.Status = SellerStatus.Approved;

            var user = await _context.Set<User>().FirstOrDefaultAsync(u => u.Id == seller.UserId && !u.IsDeleted);
            if (user != null)
            {
                user.UserType = UserTypes.Seller; 
            }

            await _context.SaveChangesAsync();
            await _auditLogService.LogAuditAsync(seller.UserId, "SELLER_APPLICATION_APPROVED", "Seller", sellerId, $"StoreName: {seller.StoreName}");
        }

        // admin red mekanizması
        public async Task RejectSellerAsync(long sellerId)
        {
            var seller = await _context.Set<Seller>().FirstOrDefaultAsync(s => s.Id == sellerId && !s.IsDeleted);
            if (seller == null)
                throw new NotFoundException("Satıcı başvurusu bulunamadı.");

            if (seller.Status == SellerStatus.Approved)
                throw new BusinessRuleException("Onaylanmış bir dükkanı reddedemezsiniz.");

            seller.Status = SellerStatus.Rejected;

            await _context.SaveChangesAsync();
            await _auditLogService.LogAuditAsync(seller.UserId, "SELLER_APPLICATION_REJECTED", "Seller", sellerId, $"StoreName: {seller.StoreName}");
        }

        // satıcının public profilini çekmek için
        public async Task<SellerPublicProfileDto> GetSellerProfileAsync(long sellerId)
        {
            var sellerDto = await _context.Set<Seller>()
                .Where(s => s.Id == sellerId && !s.IsDeleted)
                .Select(s => new SellerPublicProfileDto
                {
                    Id = s.Id,
                    StoreName = s.StoreName,

                    //  satıcı logosu
                    StoreLogoUrl = $"https://api.dicebear.com/7.x/initials/svg?seed={Uri.EscapeDataString(s.StoreName)}",

                    //  user tablosundan satıcının adını ve soyadı
                    OwnerFullName = s.User.FirstName + " " + s.User.LastName,

                    //  müşteri destek hattı
                    ContactLine = !string.IsNullOrEmpty(s.SupportLine) ? s.SupportLine : "Müşteri destek hattı belirtilmedi",

                    //  satıcının aktif ürünlerini listeleme
                    Products = s.Products.Select(p => new ProductListDto
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Description = p.Description,
                        Price = p.Price,
                        Stock = p.Stock,
                        CategoryName = p.Category.Name, 
                        StoreName = s.StoreName,        

                        MainImageUrl = p.ProductImages.Where(img => img.IsMain).Select(img => img.ImageUrl).FirstOrDefault()
                                       ?? p.ProductImages.Select(img => img.ImageUrl).FirstOrDefault(),
                        ImageUrls = p.ProductImages.Select(img => img.ImageUrl).ToList()
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            // eğer satıcı bulunamazsa NotFoundException fırlat
            if (sellerDto == null)
                throw new NotFoundException("Aradığınız mağaza sistemde bulunamadı.");

            return sellerDto;
        }

        public async Task<Seller?> GetSellerByUserIdAsync(long userId)
        {
            return await _context.Set<Seller>().FirstOrDefaultAsync(s => s.UserId == userId && !s.IsDeleted);
        }
    }
}