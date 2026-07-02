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

            RuleFor(x => x.CardHolderName)
                .NotEmpty().WithMessage("Kart sahibi ismi boş bırakılamaz.");

            RuleFor(x => x.CardNumber)
                .NotEmpty().WithMessage("Kart numarası boş bırakılamaz.")
                .Matches(@"^(?:\d{16}|\d{4}\s\d{4}\s\d{4}\s\d{4})$").WithMessage("Kart numarası 16 haneli olmalıdır.");

            RuleFor(x => x.CardExpiry)
                .NotEmpty().WithMessage("Son kullanma tarihi boş bırakılamaz.")
                .Matches(@"^(0[1-9]|1[0-2])\/\d{2}$").WithMessage("Son kullanma tarihi AA/YY formatında olmalıdır.");

            RuleFor(x => x.CardCvv)
                .NotEmpty().WithMessage("CVV kodu boş bırakılamaz.")
                .Matches(@"^\d{3}$").WithMessage("CVV kodu 3 haneli olmalıdır.");
        }
    }
}