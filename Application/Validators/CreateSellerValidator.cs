using FluentValidation;
using SirenStore.Application.DTOs;

namespace SirenStore.Application.Validators
{
    public class CreateSellerValidator : AbstractValidator<CreateSellerDto>
    {
        public CreateSellerValidator()
        {
            RuleFor(s => s.StoreName)
                .NotEmpty().WithMessage("Mağaza adı boş bırakılamaz.")
                .MinimumLength(3).WithMessage("Mağaza adı en az 3 karakter olmalıdır.")
                .MaximumLength(150).WithMessage("Mağaza adı en fazla 150 karakter olabilir.");

            RuleFor(s => s.ContactEmail)
                .NotEmpty().WithMessage("E-posta adresi boş bırakılamaz.")
                .EmailAddress().WithMessage("Geçersiz e-posta formatı.");

            RuleFor(s => s.ContactPhone)
                .NotEmpty().WithMessage("İletişim telefonu boş bırakılamaz.")
                .Matches(@"^\+?[1-9]\d{1,14}$").WithMessage("Geçersiz telefon numarası formatı.");
        }
    }
}