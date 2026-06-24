using FluentValidation;
using SirenStore.Application.DTOs;

namespace SirenStore.Application.Validators
{
using SirenStore.Application.Interfaces;
using Entities.Models;

    public class CreateProductValidator : AbstractValidator<CreateProductDto>
    {
        public CreateProductValidator(
            IRepository<Category> categoryRepository,
            IRepository<Seller> sellerRepository)
        {
            RuleFor(p => p.Name)
                .NotEmpty().WithMessage("Ürün adı boş bırakılamaz.")
                .MaximumLength(60).WithMessage("Ürün adı en fazla 60 karakter olabilir.");

            RuleFor(p => p.Brand)
                .NotEmpty().WithMessage("Marka adı boş bırakılamaz.")
                .MaximumLength(30).WithMessage("Marka adı en fazla 30 karakter olabilir.");

            RuleFor(p => p.Description)
                .NotEmpty().WithMessage("Ürün açıklaması boş bırakılamaz.")
                .MaximumLength(150).WithMessage("Ürün açıklaması en fazla 150 karakter olabilir.");

            RuleFor(p => p.Price)
                .GreaterThan(0).WithMessage("Ürün fiyatı 0'dan büyük olmalıdır.");

            RuleFor(p => p.Stock)
                .GreaterThanOrEqualTo(0).WithMessage("Stok adedi negatif olamaz.");

            RuleFor(p => p.SellerId)
                .GreaterThan(0).WithMessage("Ürünün mutlaka geçerli bir satıcısı (SellerId) olmalıdır.")
                .MustAsync(async (id, ct) => await sellerRepository.GetByIdAsync(id) != null)
                .WithMessage("Gönderilen ID'ye sahip bir satıcı (Seller) bulunamadı.");

            // Validate category exists in DB
            RuleFor(p => p.CategoryId)
                .GreaterThan(0).WithMessage("Ürünün mutlaka geçerli bir kategorisi (CategoryId) olmalıdır.")
                .MustAsync(async (id, ct) => await categoryRepository.GetByIdAsync(id) != null)
                .WithMessage("Gönderilen ID'ye sahip bir kategori (Category) bulunamadı.");
        }
    }
}
