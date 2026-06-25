using FluentValidation;
using SirenStore.Application.DTOs;

namespace SirenStore.Application.Validators
{
    public class CreateOrderDtoValidator : AbstractValidator<CreateOrderDto>
    {
        public CreateOrderDtoValidator()
        {
            RuleFor(x => x.AddressTitle)
                .NotEmpty().WithMessage("Adres başlığı boş bırakılamaz.")
                .MaximumLength(100).WithMessage("Adres başlığı en fazla 100 karakter olabilir.");

            RuleFor(x => x.ShippingAddress)
                .NotEmpty().WithMessage("Teslimat adresi boş bırakılamaz.")
                .MinimumLength(10).WithMessage("Lütfen daha detaylı bir adres giriniz (En az 10 karakter).")
                .MaximumLength(500).WithMessage("Teslimat adresi en fazla 500 karakter olabilir.");
        }
    }
}