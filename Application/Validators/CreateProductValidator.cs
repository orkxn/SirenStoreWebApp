using FluentValidation;
using SirenStore.Application.DTOs;

namespace SirenStore.Application.Validators
{
    public class CreateProductValidator : AbstractValidator<CreateProductDto>
    {
        public CreateProductValidator()
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
                .GreaterThan(0).WithMessage("Ürünün mutlaka geçerli bir satıcısı (SellerId) olmalıdır.");

            RuleFor(p => p.CategoryId)
                .GreaterThan(0).WithMessage("Ürünün mutlaka geçerli bir kategorisi (CategoryId) olmalıdır.");
        }
    }
}