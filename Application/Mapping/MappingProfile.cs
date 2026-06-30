using Application.DTOs.Comment;
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
            // kaydederken : CreateAdminDto'daki Username alanını User'ın FirstName alanına, LastName alanını boş string olarak yaz
            CreateMap<CreateAdminDto, User>()
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.Username))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => string.Empty)); // Boş geçmemek için

            // çekerken : User'daki FirstName alanını AdminDto'daki Username alanına, UserType alanını Role alanına yaz
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
                // enum durumunu string metne çeviriyoruz ("Received", "Shipped" vb.)
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                // alt kalemlerin List<OrderItem> otomatik haritalanması için EF Core ilişkisini bağlıyoruz
                .ForMember(dest => dest.OrderItems, opt => opt.MapFrom(src => src.OrderItems));

            // OrderItem -> OrderItemDto 
            CreateMap<OrderItem, OrderItemDto>()
                // düzleştirilmiş DTO'da ProductName alanını OrderItem içindeki Product.Name alanından alıyoruz
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name));

            // Comment -> CommentDto Map kuralı
            CreateMap<Comment, CommentDto>()
                .ForMember(dest => dest.UserFullName,
                           opt => opt.MapFrom(src => $"{src.User.FirstName} {src.User.LastName}"));

            CreateMap<CommentCreateDto, Comment>();
            CreateMap<CommentUpdateDto, Comment>();
        }
    }
}