using Microsoft.EntityFrameworkCore;
using Entities.Enums;
using Entities.Models;
using FluentValidation;
using SirenStore.Application.DTOs;
using SirenStore.Application.Exceptions;
using SirenStore.Application.Interfaces;

namespace SirenStore.Application.Services
{
    public class SellerManager : ISellerService
    {
        private readonly IRepository<Seller> _sellerRepository;
        private readonly IRepository<User> _userRepository;
        private readonly IValidator<CreateSellerDto> _validator;
        private readonly IAuditLogService _auditLogService;

        public SellerManager(
            IRepository<Seller> sellerRepository,
            IRepository<User> userRepository,
            IValidator<CreateSellerDto> validator,
            IAuditLogService auditLogService)
        {
            _sellerRepository = sellerRepository;
            _userRepository = userRepository;
            _validator = validator;
            _auditLogService = auditLogService;
        }

        // satıcı başvuru mekanizması
        public async Task BecomeSellerAsync(long userId, CreateSellerDto dto)
        {
            await _validator.ValidateAndThrowAsync(dto);

            var user = await _userRepository.GetAsync(u => u.Id == userId && !u.IsDeleted);
            if (user == null)
                throw new NotFoundException("Kullanıcı bulunamadı.");

            var existingSeller = await _sellerRepository.GetAsync(s => s.UserId == userId);
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
                _sellerRepository.Update(existingSeller);
                await _sellerRepository.SaveChangesAsync();
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

            await _sellerRepository.AddAsync(newSeller);
            await _sellerRepository.SaveChangesAsync();
            await _auditLogService.LogAuditAsync(userId, "SELLER_APPLICATION_SUBMITTED", "Seller", newSeller.Id, $"StoreName: {dto.StoreName}");
        }

        // admin onay mekanizması
        public async Task ApproveSellerAsync(long sellerId)
        {
            var seller = await _sellerRepository.GetAsync(s => s.Id == sellerId);
            if (seller == null)
                throw new NotFoundException("Satıcı başvurusu bulunamadı.");

            if (seller.Status == SellerStatus.Approved)
                throw new BusinessRuleException("Bu başvuru zaten onaylanmış.");

            seller.Status = SellerStatus.Approved;
            _sellerRepository.Update(seller);

            var user = await _userRepository.GetAsync(u => u.Id == seller.UserId);
            if (user != null)
            {
                user.UserType = UserTypes.Seller; 
                _userRepository.Update(user);
            }

            await _sellerRepository.SaveChangesAsync();
            await _auditLogService.LogAuditAsync(seller.UserId, "SELLER_APPLICATION_APPROVED", "Seller", sellerId, $"StoreName: {seller.StoreName}");
        }

        // admin red mekanizması
        public async Task RejectSellerAsync(long sellerId)
        {
            var seller = await _sellerRepository.GetAsync(s => s.Id == sellerId);
            if (seller == null)
                throw new NotFoundException("Satıcı başvurusu bulunamadı.");

            if (seller.Status == SellerStatus.Approved)
                throw new BusinessRuleException("Onaylanmış bir dükkanı reddedemezsiniz.");

            seller.Status = SellerStatus.Rejected;
            _sellerRepository.Update(seller);

            await _sellerRepository.SaveChangesAsync();
            await _auditLogService.LogAuditAsync(seller.UserId, "SELLER_APPLICATION_REJECTED", "Seller", sellerId, $"StoreName: {seller.StoreName}");
        }

        // satıcının public profilini çekmek için
        public async Task<SellerPublicProfileDto> GetSellerProfileAsync(long sellerId)
        {
            var sellerDto = await _sellerRepository.AsQueryable()
                .Where(s => s.Id == sellerId)
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
            return await _sellerRepository.GetAsync(s => s.UserId == userId);
        }
    }
}