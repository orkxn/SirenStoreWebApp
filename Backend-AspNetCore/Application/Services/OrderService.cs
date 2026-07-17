using Entities.Enums;
using Entities.Models;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using SirenStore.Application.DTOs;
using SirenStore.Application.Exceptions;

namespace SirenStore.Application.Services
{
    public class OrderService
    {
        private readonly DbContext _context;
        private readonly IValidator<CreateOrderDto> _validator;
        private readonly AuditLogService _auditLogService;
        private readonly IMemoryCache _cache;

        public OrderService(
            DbContext context,
            IValidator<CreateOrderDto> validator,
            AuditLogService auditLogService,
            IMemoryCache cache) 
        {
            _context = context;
            _validator = validator;
            _auditLogService = auditLogService;
            _cache = cache;
        }

        // sipariş oluşturma işlemi + transaction yönetimi
        public async Task<OrderDto> CreateOrderAsync(long userId, CreateOrderDto dto)
        {
            // fluent validation ile DTO doğrulaması
            await _validator.ValidateAndThrowAsync(dto);

            var basket = await _context.Set<Basket>()
                .Include(b => b.BasketItems)
                .ThenInclude(bi => bi.Product)
                .FirstOrDefaultAsync(b => b.UserId == userId && !b.IsDeleted);

            // Sadece aktif (silinmemiş) sepet elemanlarını filtrele
            var activeBasketItems = basket?.BasketItems.Where(bi => !bi.IsDeleted).ToList();

            if (basket == null || activeBasketItems == null || !activeBasketItems.Any())
                throw new BusinessRuleException("Sepetiniz boş olduğu için sipariş oluşturulamaz.");

            // TRANSACTION BAŞLANGICI
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // üst sipariş kaydını oluşturuyoruz
                var order = new Order
                {
                    UserId = userId,
                    AddressTitle = dto.AddressTitle,
                    ShippingAddress = dto.ShippingAddress,
                    Status = OrderStatus.Received,
                    TotalPrice = activeBasketItems.Sum(bi => bi.Quantity * bi.Product!.Price)
                };

                await _context.Set<Order>().AddAsync(order);
                await _context.SaveChangesAsync(); // Order.Id'yi almak için kaydetmek zorundayız

                // sepetteki her bir ürün için stok kontrolü ve sipariş kalemi oluşturma
                foreach (var basketItem in activeBasketItems)
                {
                    var product = basketItem.Product;

                    if (product == null)
                        throw new BusinessRuleException("Sepetiniz güncel değil. Lütfen sayfayı yenileyip tekrar deneyin.");

                    // Son saniye stok kontrolü
                    if (product.Stock < basketItem.Quantity)
                        throw new BusinessRuleException($"Üzgünüz, '{product.Name}' ürünü için yeterli stok kalmadı. Mevcut Stok: {product.Stock}");

                    // stoktan düşme işlemi
                    product.Stock -= basketItem.Quantity;

                    // fiyatı sipariş anında kaydetmek için OrderItem oluşturuyoruz
                    var orderItem = new OrderItem
                    {
                        OrderId = order.Id,
                        ProductId = basketItem.ProductId,
                        Quantity = basketItem.Quantity,
                        Price = product.Price // ileride ürün fiyatı değişse bile geçmiş fatura etkilenmez
                    };
                    await _context.Set<OrderItem>().AddAsync(orderItem);
                }

                await _context.SaveChangesAsync();

                // müşteri satın alımı tamamladı, sadece sipariş verilen aktif sepet kalemlerini temizliyoruz
                foreach (var bi in activeBasketItems)
                {
                    bi.IsDeleted = true;
                }
                await _context.SaveChangesAsync();

                // her şey kusursuz bittiyse veritabanına commit
                await transaction.CommitAsync();

                // cache invalidation: sipariş sonrası değişen ürün stoklarını temizle
                foreach (var basketItem in activeBasketItems)
                {
                    _cache.Remove($"Product_Detail_{basketItem.ProductId}");
                }

                // audit: Sipariş oluşturma logu
                await _auditLogService.LogAuditAsync(userId, "ORDER_CREATED", "Order", order.Id, $"TotalPrice: {order.TotalPrice}");

                // Yeni siparişin detaylarını geri döndürüyoruz DTO olarak
                return await GetOrderByIdAsync(userId, order.Id);
            }
            catch (Exception)
            {
                // döngüde hata olursa transaction'ı geri alıyoruz 
                await transaction.RollbackAsync();
                throw;
            }
        }

        // müşterinin kendi siparişlerini listeleme
        public async Task<List<OrderDto>> GetUserOrdersAsync(long userId)
        {
            return await _context.Set<Order>()
                .Where(o => o.UserId == userId && !o.IsDeleted) // sadece kendi siparişlerini ve silinmemiş olanları alır
                .OrderByDescending(o => o.CreationDate)
                .Select(o => new OrderDto
                {
                    Id = o.Id,
                    CreatedDate = o.CreationDate,
                    TotalPrice = o.TotalPrice,
                    AddressTitle = o.AddressTitle,
                    ShippingAddress = o.ShippingAddress,
                    Status = o.Status.ToString(),
                    // sipariş kalemlerini de DTO'ya mapliyoruz    
                    OrderItems = o.OrderItems.Where(oi => !oi.IsDeleted).Select(oi => new OrderItemDto
                    {
                        Id = oi.Id,
                        ProductId = oi.ProductId ?? 0,

                        // ürün tamamen veritabanından silindiyse silindiğini belirtmek için özel mesaj
                        ProductName = oi.Product != null ? oi.Product.Name : "Silinmiş Ürün",
                        Quantity = oi.Quantity,
                        Price = oi.Price, // satın alındığı anki fiyat 
                        Status = oi.Status.ToString()
                    }).ToList()
                })
                .ToListAsync();
        }

        // satıcının kendi ürünlerine ait siparişleri listeleme
        public async Task<List<OrderDto>> GetSellerOrdersAsync(long userId)
        {
            var seller = await _context.Set<Seller>().FirstOrDefaultAsync(s => s.UserId == userId && !s.IsDeleted);
            if (seller == null || seller.Status != SellerStatus.Approved)
                throw new ForbiddenException("Bu işlem için onaylı bir satıcı hesabınız bulunmuyor.");

            // Siparişleri (Order), içindeki OrderItem'larla birlikte tarayacağız. 
            // Sadece bu satıcıya ait (seller.Id) OrderItem içeren siparişleri getir.
            var orders = await _context.Set<Order>()
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Where(o => !o.IsDeleted && o.OrderItems.Any(oi => !oi.IsDeleted && oi.Product != null && oi.Product.SellerId == seller.Id))
                .OrderByDescending(o => o.CreationDate)
                .ToListAsync(); // sadece siparişleri çekiyoruz, OrderItem'ları filtreleyeceğiz

            // bellekte filtreleme ve DTO'ya mapleme
            return orders.Select(o => new OrderDto
            {
                Id = o.Id,
                CreatedDate = o.CreationDate,
                TotalPrice = o.OrderItems
                    .Where(oi => !oi.IsDeleted && oi.Product != null && oi.Product.SellerId == seller.Id)
                    .Sum(oi => oi.Quantity * oi.Price), // sadece bu satıcıya ait ürünlerin toplam fiyatını hesaplıyoruz
                AddressTitle = o.AddressTitle,
                ShippingAddress = o.ShippingAddress,
                Status = o.Status.ToString(),
                OrderItems = o.OrderItems
                    .Where(oi => !oi.IsDeleted && oi.Product != null && oi.Product.SellerId == seller.Id)
                    .Select(oi => new OrderItemDto
                    {
                        Id = oi.Id, // frontendde status güncellemek için ID lazım
                        ProductId = oi.ProductId ?? 0,
                        ProductName = oi.Product!.Name,
                        Quantity = oi.Quantity,
                        Price = oi.Price,
                        Status = oi.Status.ToString()
                    }).ToList()
            }).ToList();
        }

        // tek bir siparişin detaylarını getirme
        public async Task<OrderDto> GetOrderByIdAsync(long userId, long orderId)
        {
            var orderDto = await _context.Set<Order>()
                .Where(o => o.Id == orderId && o.UserId == userId && !o.IsDeleted)
                .Select(o => new OrderDto
                {
                    Id = o.Id,
                    CreatedDate = o.CreationDate,
                    TotalPrice = o.TotalPrice,
                    AddressTitle = o.AddressTitle,
                    ShippingAddress = o.ShippingAddress,
                    Status = o.Status.ToString(),
                    OrderItems = o.OrderItems.Where(oi => !oi.IsDeleted).Select(oi => new OrderItemDto
                    {
                        Id = oi.Id,
                        ProductId = oi.ProductId ?? 0,
                        ProductName = oi.Product != null ? oi.Product.Name : "Silinmiş Ürün",
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

        // sipariş durumunu güncelleme
        public async Task UpdateOrderItemStatusAsync(long userId, long orderItemId, OrderStatus newStatus)
        {
            var orderItem = await _context.Set<OrderItem>()
                .Include(oi => oi.Product)
                .FirstOrDefaultAsync(oi => oi.Id == orderItemId && !oi.IsDeleted);

            if (orderItem == null)
                throw new NotFoundException("Sipariş kalemi bulunamadı.");

            var user = await _context.Set<User>().FirstOrDefaultAsync(u => u.Id == userId && !u.IsDeleted);

            if (user == null)
                throw new UnauthorizedAccessException("Kullanıcı bulunamadı veya oturumunuz geçersiz.");

            if (user.UserType != UserTypes.Admin)
            {
                var seller = await _context.Set<Seller>().FirstOrDefaultAsync(s => s.UserId == userId && !s.IsDeleted);
                if (seller == null || seller.Status != SellerStatus.Approved)
                    throw new SirenStore.Application.Exceptions.ForbiddenException("Bu işlem için onaylı bir satıcı hesabınız bulunmuyor.");

                if (orderItem.Product!.SellerId != seller.Id)
                    throw new BusinessRuleException("Farklı bir satıcıya ait ürünün sipariş durumunu değiştiremezsiniz!");
            }

            orderItem.Status = newStatus;
            await _context.SaveChangesAsync();

            // audit: Sipariş kalemi durum güncelleme logu
            await _auditLogService.LogAuditAsync(userId, "ORDER_ITEM_STATUS_UPDATED", "OrderItem", orderItem.Id, $"NewStatus: {newStatus}");
        }

        public async Task<List<SavedAddressDto>> GetSavedAddressesAsync(long userId)
        {
            return await _context.Set<Order>()
                .Where(o => o.UserId == userId && !o.IsDeleted && !string.IsNullOrEmpty(o.AddressTitle))
                .GroupBy(o => new { o.AddressTitle, o.ShippingAddress })
                .Select(g => new
                {
                    AddressTitle = g.Key.AddressTitle,
                    ShippingAddress = g.Key.ShippingAddress,
                    LastUsed = g.Max(x => x.CreationDate)
                })
                .OrderByDescending(x => x.LastUsed)
                .Select(x => new SavedAddressDto
                {
                    AddressTitle = x.AddressTitle,
                    ShippingAddress = x.ShippingAddress
                })
                .ToListAsync();
        }

        public async Task DeleteSavedAddressAsync(long userId, string addressTitle)
        {
            var orders = await _context.Set<Order>()
                .Where(o => o.UserId == userId && o.AddressTitle == addressTitle && !o.IsDeleted)
                .ToListAsync();

            foreach (var order in orders)
            {
                order.AddressTitle = string.Empty;
            }

            await _context.SaveChangesAsync();

            // audit loglama
            await _auditLogService.LogAuditAsync(userId, "SAVED_ADDRESS_DELETED", "Order", 0, $"AddressTitle: {addressTitle}");
        }
    }
}