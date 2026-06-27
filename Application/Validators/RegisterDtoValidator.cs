using FluentValidation;
using SirenStore.Application.DTOs;

namespace SirenStore.Application.Validators
{
    public class RegisterDtoValidator : AbstractValidator<RegisterDto>
    {
        public RegisterDtoValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("E-posta adresi boş bırakılamaz.")
                .EmailAddress().WithMessage("Lütfen geçerli bir e-posta adresi giriniz.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Şifre boş bırakılamaz.")
                .MinimumLength(6).WithMessage("Şifre en az 6 karakter olmalıdır.");

            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("Ad alanı boş bırakılamaz.");

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Soyad alanı boş bırakılamaz.");

            RuleFor(x => x.PhoneNumber)
                .NotEmpty().WithMessage("Telefon alanı boş bırakılamaz.")
                .Length(10).WithMessage("Telefon numaranız tam olarak 10 haneli olmalıdır.")
                .Matches(@"^5\d{9}$").WithMessage("Telefon numaranız 5 ile başlayan 10 haneli bir numara olmalıdır (Örn: 5XXXXXXXXX).");

        }
    }
}