using SirenStore.Application.Interfaces;
using SirenStore.Application.Exceptions;
using Entities.Models;
using Entities.Enums;

namespace SirenStore.Application.Services
{
    public class AdminManager(
        IRepository<Seller> sellerRepository,
        IRepository<Product> productRepository,
        IRepository<User> userRepository) : IAdminService
    {
        // 1. SATICIYI ONAYLAMA
        public async Task ApproveSellerAsync(long sellerId)
        {
            var seller = await sellerRepository.GetByIdAsync(sellerId);
            if (seller == null || seller.IsDeleted)
                throw new NotFoundException("Satıcı", sellerId);

            seller.IsApproved = true;
            sellerRepository.Update(seller);
            await sellerRepository.SaveChangesAsync();
        }

        // 2. SATICIYI SOFT DELETE ETME
        public async Task SoftDeleteSellerAsync(long sellerId)
        {
            var seller = await sellerRepository.GetByIdAsync(sellerId);
            if (seller == null || seller.IsDeleted)
                throw new NotFoundException("Satıcı", sellerId);

            seller.IsDeleted = true;
            seller.IsActive = false; // Silinen satıcı doğal olarak pasif olur

            sellerRepository.Update(seller);
            await sellerRepository.SaveChangesAsync();
        }

        // 3. ÜRÜNÜ SOFT DELETE ETME (Kalıcı Gizleme)
        public async Task SoftDeleteProductAsync(long productId)
        {
            var product = await productRepository.GetByIdAsync(productId);
            if (product == null || product.IsDeleted)
                throw new NotFoundException("Ürün", productId);

            product.IsDeleted = true;
            product.IsActive = false;

            productRepository.Update(product);
            await productRepository.SaveChangesAsync();
        }

        // 4. DİĞER USERLARI SOFT DELETE ETME (KRİTİK KORUMA BURADA!)
        public async Task SoftDeleteUserAsync(long userId)
        {
            var user = await userRepository.GetByIdAsync(userId);
            if (user == null || user.IsDeleted)
                throw new NotFoundException("Kullanıcı", userId);

            // KORUMA KURALI: Eğer silinmeye çalışılan kişi Admin veya SuperAdmin ise ENGELLE!
            if (user.UserType == UserTypes.Admin || user.UserType == UserTypes.SuperAdmin || user.UserType == UserTypes.Seller)
            {
                throw new BusinessRuleException("Silme işlemi yetki dolayısıyla geçersizdir.");
            }

            // Eğer kuralı geçtiyse (yani Customer vb. ise) soft delete yap
            user.IsDeleted = true;
            user.IsActive = false;

            userRepository.Update(user);
            await userRepository.SaveChangesAsync();
        }
    }
}