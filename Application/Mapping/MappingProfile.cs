using AutoMapper;
using Entities.Models;
using SirenStore.Application.DTOs;

namespace SirenStore.Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Seller
            CreateMap<CreateSellerDto, Seller>();
            CreateMap<Seller, SellerDto>();

            // Product
            CreateMap<CreateProductDto, Product>();
            CreateMap<Product, ProductDto>();

            // Admin
            // 1. Kaydederken: CreateAdminDto içindeki Username'i, User'ın FirstName alanına yaz
            CreateMap<CreateAdminDto, User>()
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.Username))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => string.Empty)); // Boş geçmemek için

            // 2. Çekerken: User'ın FirstName alanını Username'e, UserType enum'ını string olarak Role alanına yaz
            CreateMap<User, AdminDto>()
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.FirstName))
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.UserType.ToString()));

            // User
            CreateMap<User, UserProfileDto>();

            // Basket
            CreateMap<Basket, BasketDto>();
            CreateMap<BasketItem, BasketItemDto>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Product.Price))
                .ForMember(dest => dest.ProductImageUrl, opt => opt.MapFrom(src => src.Product.ProductImages.FirstOrDefault(img => img.IsMain).ImageUrl));

            // Order
            CreateMap<Order, OrderDto>()
                // Enum durumunu string metne çeviriyoruz ("Received", "Shipped" vb.)
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                // Alt kalemlerin List<OrderItem> otomatik haritalanması için EF Core ilişkisini bağlıyoruz
                .ForMember(dest => dest.OrderItems, opt => opt.MapFrom(src => src.OrderItems));

            // 2. OrderItem -> OrderItemDto Haritalaması
            CreateMap<OrderItem, OrderItemDto>()
                // Düzleştirme (Flattening): Ürün adını bağlı olan Product tablosundan çekiyoruz
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name));
        }
    }
}