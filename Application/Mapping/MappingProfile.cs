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
        }
    }
}