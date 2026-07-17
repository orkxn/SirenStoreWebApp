using FluentValidation;
using SirenStore.Application.DTOs;

namespace SirenStore.Application.Validators
{
    public class AddToBasketDtoValidator : AbstractValidator<AddToBasketDto>
    {
        public AddToBasketDtoValidator()
        {
            RuleFor(x => x.ProductId)
                .GreaterThan(0).WithMessage("Lütfen geçerli bir ürün seçiniz.");

            RuleFor(x => x.Quantity)
                .GreaterThan(0).WithMessage("Sepete en az 1 adet ürün eklemelisiniz.")
                .LessThanOrEqualTo(100).WithMessage("Tek seferde en fazla 100 adet aynı üründen ekleyebilirsiniz.");
        }
    }
}