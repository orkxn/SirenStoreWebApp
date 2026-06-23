using AutoMapper;
using Entities.Models;
using SirenStore.Application.DTOs;

namespace SirenStore.Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // CreateSellerDto'yu Seller entity nesnesine çevir (Veri tabanına kaydederken)
            CreateMap<CreateSellerDto, Seller>();

            // Seller entity nesnesini SellerDto'ya çevir (Angular'a veri gönderirken)
            CreateMap<Seller, SellerDto>();


            // ---------- PRODUCT MODÜLÜ EŞLEŞTİRMELERİ ----------
            CreateMap<CreateProductDto, Product>();
            CreateMap<Product, ProductDto>();


            // Hatırla: Admin için ayrı tablo yoktu, User tablosunu kullanıyorduk.
            CreateMap<CreateAdminDto, User>();
            CreateMap<User, AdminDto>();
        }
    }
}