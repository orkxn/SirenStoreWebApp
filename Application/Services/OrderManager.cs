using Entities.Enums;
using Entities.Models;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using SirenStore.Application.DTOs;
using SirenStore.Application.Exceptions;
using SirenStore.Application.Interfaces;

namespace SirenStore.Application.Services
{
    public class OrderManager : IOrderService
    {
        private readonly IRepository<Order> _orderRepository;
        private readonly IRepository<OrderItem> _orderItemRepository;
        private readonly IRepository<Basket> _basketRepository;
        private readonly IRepository<Product> _productRepository;
        private readonly IRepository<BasketItem> _basketItemRepository;
        private readonly IValidator<CreateOrderDto> _validator;
        private readonly IRepository<Seller> _sellerRepository;
        private readonly IRepository<User> _userRepository;
        private readonly DbContext _context;

        public OrderManager(
            IRepository<Order> orderRepository,
            IRepository<OrderItem> orderItemRepository,
            IRepository<Basket> basketRepository,
            IRepository<Product> productRepository,
            IRepository<BasketItem> basketItemRepository,
            IValidator<CreateOrderDto> validator,
            IRepository<Seller> sellerRepository,
            IRepository<User> userRepository,
            DbContext context) 
        {
            _orderRepository = orderRepository;
            _orderItemRepository = orderItemRepository;
            _basketRepository = basketRepository;
            _productRepository = productRepository;
            _basketItemRepository = basketItemRepository;
            _validator = validator;
            _sellerRepository = sellerRepository;
            _userRepository = userRepository;
            _context = context;
        }

        // 1. SİPARİŞ OLUŞTURMA (Transaction & Stok Yönetimi)
        public async Task<OrderDto> CreateOrderAsync(long userId, CreateOrderDto dto)
        {
            // FluentValidation kontrolü
            await _validator.ValidateAndThrowAsync(dto);

            // Kullanıcının sepetini ve içindeki ürünleri çekiyoruz
            var basket = await _basketRepository.AsQueryable()
                .Include(b => b.BasketItems)
                .ThenInclude(bi => bi.Product)
                .FirstOrDefaultAsync(b => b.UserId == userId);

            if (basket == null || !basket.BasketItems.Any())
                throw new BusinessRuleException("Sepetiniz boş olduğu için sipariş oluşturulamaz.");

            // TRANSACTION BAŞLANGICI: Veri bütünlüğünü koruma kalkanı
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Üst sipariş kaydını oluşturuyoruz
                var order = new Order
                {
                    UserId = userId,
                    AddressTitle = dto.AddressTitle,
                    ShippingAddress = dto.ShippingAddress,
                    Status = OrderStatus.Received,
                    TotalPrice = basket.BasketItems.Sum(bi => bi.Quantity * bi.Product.Price)
                };

                await _orderRepository.AddAsync(order);
                await _orderRepository.SaveChangesAsync(); // Order ID'sinin oluşması için db'ye hafifçe vuruyoruz

                // Sepetteki ürünleri tek tek sipariş kalemine dönüştürme ve stok düşme döngüsü
                foreach (var basketItem in basket.BasketItems)
                {
                    var product = basketItem.Product;

                    // Son saniye stok kontrolü (Başka biri ürünü bitirmiş mi?)
                    if (product.Stock < basketItem.Quantity)
                        throw new BusinessRuleException($"Üzgünüz, '{product.Name}' ürünü için yeterli stok kalmadı. Mevcut Stok: {product.Stock}");

                    // Stoktan Düşme Operasyonu
                    product.Stock -= basketItem.Quantity;
                    _productRepository.Update(product);

                    // Sipariş Kalemi Oluşturma (Fiyatı o an donduruyoruz!)
                    var orderItem = new OrderItem
                    {
                        OrderId = order.Id,
                        ProductId = basketItem.ProductId,
                        Quantity = basketItem.Quantity,
                        Price = product.Price // İleride ürün fiyatı değişse bile geçmiş fatura etkilenmez
                    };
                    await _orderItemRepository.AddAsync(orderItem);
                }

                await _orderItemRepository.SaveChangesAsync();

                // Müşteri satın alımı tamamladı, sepet kalemlerini temizliyoruz
                foreach (var bi in basket.BasketItems.ToList())
                {
                    _basketItemRepository.Remove(bi);
                }
                await _basketItemRepository.SaveChangesAsync();

                // Her şey kusursuz bittiyse veritabanına kalıcı olarak mühürle!
                await transaction.CommitAsync();

                // Yeni oluşan siparişin detayını DTO olarak geri dönüyoruz
                return await GetOrderByIdAsync(userId, order.Id);
            }
            catch (Exception)
            {
                // Döngünün herhangi bir yerinde hata çıkarsa yapılan tüm işlemleri (stok düşmelerini dahil) geri al!
                await transaction.RollbackAsync();
                throw;
            }
        }

        // 2. MÜŞTERİNİN GEÇMİŞ SİPARİŞLERİ (LINQ Projeksiyon Mapping)
        public async Task<List<OrderDto>> GetUserOrdersAsync(long userId)
        {
            return await _orderRepository.AsQueryable()
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreationDate) // En yeni sipariş en üstte görünsün
                .Select(o => new OrderDto
                {
                    Id = o.Id,
                    CreatedDate = o.CreationDate,
                    TotalPrice = o.TotalPrice,
                    AddressTitle = o.AddressTitle,
                    ShippingAddress = o.ShippingAddress,
                    Status = o.Status.ToString(),
                    OrderItems = o.OrderItems.Select(oi => new OrderItemDto
                    {
                        ProductId = oi.ProductId,
                        ProductName = oi.Product.Name,
                        Quantity = oi.Quantity,
                        Price = oi.Price,
                        Status = oi.Status.ToString()
                    }).ToList()
                })
                .ToListAsync();
        }

        // 3. TEK BİR SİPARİŞİN DETAYI (Güvenlikli / Sadece Kendi Siparişi)
        public async Task<OrderDto> GetOrderByIdAsync(long userId, long orderId)
        {
            var orderDto = await _orderRepository.AsQueryable()
                .Where(o => o.Id == orderId && o.UserId == userId) // IDOR
                .Select(o => new OrderDto
                {
                    Id = o.Id,
                    CreatedDate = o.CreationDate,
                    TotalPrice = o.TotalPrice,
                    AddressTitle = o.AddressTitle,
                    ShippingAddress = o.ShippingAddress,
                    Status = o.Status.ToString(),
                    OrderItems = o.OrderItems.Select(oi => new OrderItemDto
                    {
                        ProductId = oi.ProductId,
                        ProductName = oi.Product.Name,
                        Quantity = oi.Quantity,
                        Price = oi.Price,
                        Status = oi.Status.ToString()
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (orderDto == null)
                throw new NotFoundException("Aradığınız sipariş bulunamadı veya bu siparişe erişim yetkiniz yok.");

            return orderDto;
        }

        // 4. SİPARİŞ DURUMU GÜNCELLEME (Satıcı/Admin Paneli İçin)
        public async Task UpdateOrderItemStatusAsync(long userId, long orderItemId, OrderStatus newStatus)
        {
            // 1. Sipariş kalemini, bağlı olduğu Ürün (Product) bilgisiyle birlikte çekiyoruz
            var orderItem = await _orderItemRepository.AsQueryable()
                .Include(oi => oi.Product)
                .FirstOrDefaultAsync(oi => oi.Id == orderItemId);

            if (orderItem == null)
                throw new NotFoundException("Sipariş kalemi bulunamadı.");

            // 2. İşlemi yapan kullanıcının genel bilgilerini çekiyoruz
            var user = await _userRepository.GetAsync(u => u.Id == userId);

            // Eğer kullanıcı veritabanında yoksa 401 Unauthorized dönelim
            if (user == null)
                throw new UnauthorizedAccessException("Kullanıcı bulunamadı veya oturumunuz geçersiz.");

            // IDOR KORUMASI
            if (user.UserType != UserTypes.Admin)
            {
                // Kullanıcının onaylanmış bir satıcı profili var mı?
                var seller = await _sellerRepository.GetAsync(s => s.UserId == userId);
                if (seller == null || seller.Status != SellerStatus.Approved)
                    throw new SirenStore.Application.Exceptions.ForbiddenException("Bu işlem için onaylı bir satıcı hesabınız bulunmuyor.");

                // Bu sipariş kalemindeki ürün gerçekten bu satıcıya mı ait
                if (orderItem.Product.SellerId != seller.Id)
                    throw new BusinessRuleException("Farklı bir satıcıya ait ürünün sipariş durumunu değiştiremezsiniz!");
            }

            // 3. Güvenlik duvarından başarıyla geçildiyse SADECE o kalemin durumunu güncelliyoruz
            orderItem.Status = newStatus;
            _orderItemRepository.Update(orderItem);

            await _orderItemRepository.SaveChangesAsync();
        }
    }
}