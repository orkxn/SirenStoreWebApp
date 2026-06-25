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
        private readonly IValidator<BecomeSellerRequestDto> _validator;

        public SellerManager(
            IRepository<Seller> sellerRepository,
            IRepository<User> userRepository,
            IValidator<BecomeSellerRequestDto> validator)
        {
            _sellerRepository = sellerRepository;
            _userRepository = userRepository;
            _validator = validator;
        }

        // 1. SATICI BAŞVURUSU YAPMA
        public async Task BecomeSellerAsync(long userId, BecomeSellerRequestDto dto)
        {
            // Boş mu, formatı hatalı mı?
            await _validator.ValidateAndThrowAsync(dto);

            // Kullanıcı gerçekten var mı ve aktif mi?
            var user = await _userRepository.GetAsync(u => u.Id == userId && !u.IsDeleted);
            if (user == null)
                throw new NotFoundException("Kullanıcı bulunamadı.");

            // Zaten bir başvurusu veya dükkanı var mı? (Çift başvuru engelleme)
            var existingSeller = await _sellerRepository.GetAsync(s => s.UserId == userId);
            if (existingSeller != null)
            {
                if (existingSeller.Status == SellerStatus.Pending)
                    throw new BusinessRuleException("Zaten bekleyen bir satıcı başvurunuz bulunuyor.");
                if (existingSeller.Status == SellerStatus.Approved)
                    throw new BusinessRuleException("Zaten onaylı bir mağazanız var.");
            }

            // Yeni satıcı başvuru kaydı oluştur
            var newSeller = new Seller
            {
                UserId = userId,
                StoreName = dto.StoreName,
                TaxNumber = dto.TaxNumber,
                TaxOffice = dto.TaxOffice,
                Status = SellerStatus.Pending // Varsayılan olarak onay bekliyor
            };

            await _sellerRepository.AddAsync(newSeller);
            await _sellerRepository.SaveChangesAsync();
        }

        // 2. ADMIN ONAY MEKANİZMASI
        public async Task ApproveSellerAsync(long sellerId)
        {
            // Başvuru kaydını bul
            var seller = await _sellerRepository.GetAsync(s => s.Id == sellerId);
            if (seller == null)
                throw new NotFoundException("Satıcı başvurusu bulunamadı.");

            if (seller.Status == SellerStatus.Approved)
                throw new BusinessRuleException("Bu başvuru zaten onaylanmış.");

            // Durumu onaylandıya çek
            seller.Status = SellerStatus.Approved;
            _sellerRepository.Update(seller);

            // Kullanıcının rolünü (UserType) "Seller" olarak güncelle
            var user = await _userRepository.GetAsync(u => u.Id == seller.UserId);
            if (user != null)
            {
                user.UserType = UserTypes.Seller; // Kullanıcı artık bir satıcı
                _userRepository.Update(user);
            }

            await _sellerRepository.SaveChangesAsync();
        }

        // 3. ADMIN RED MEKANİZMASI
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
        }

        public async Task<SellerPublicProfileDto> GetSellerProfileAsync(long sellerId)
        {
            var sellerDto = await _sellerRepository.AsQueryable()
                .Where(s => s.Id == sellerId)
                .Select(s => new SellerPublicProfileDto
                {
                    Id = s.Id,
                    StoreName = s.StoreName,

                    //  1. Yöntem: Veritabanında kolon yok, Dicebear API ile dinamik SVG logo üretiyoruz
                    StoreLogoUrl = $"https://api.dicebear.com/7.x/initials/svg?seed={Uri.EscapeDataString(s.StoreName)}",

                    //  2. Yöntem: User tablosundan isim ve soyisim birleştirme
                    OwnerFullName = s.User.FirstName + " " + s.User.LastName,

                    //  3. Yöntem: User tablosundaki telefon numarasını ContactLine alanına eşleme
                    ContactLine = s.User.PhoneNumber ?? "İletişim numarası belirtilmedi",

                    //  4. Yöntem: Satıcıya ait aktif ürünlerin listelenmesi (ProductListDto kalıbında)
                    Products = s.Products.Select(p => new ProductListDto
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Description = p.Description, // DTO'nda var, bunu da besleyelim pürüzsüz olsun
                        Price = p.Price,
                        Stock = p.Stock,
                        CategoryName = p.Category.Name, // Kategori adını ilişkiden çekiyoruz
                        StoreName = s.StoreName,        // Satıcının kendi mağaza adı

                        MainImageUrl = p.ProductImages.Where(img => img.IsMain).Select(img => img.ImageUrl).FirstOrDefault()
                                       ?? p.ProductImages.Select(img => img.ImageUrl).FirstOrDefault()
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            // Güvenlik duvarı: Eğer böyle bir satıcı yoksa null dönüp frontend'i patlatmıyoruz, kontrollü hata fırlatıyoruz
            if (sellerDto == null)
                throw new NotFoundException("Aradığınız mağaza sistemde bulunamadı.");

            return sellerDto;
        }
    }
}