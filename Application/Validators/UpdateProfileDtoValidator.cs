using FluentValidation;
using SirenStore.Application.DTOs;

namespace SirenStore.Application.Validators
{
    public class UpdateProfileDtoValidator : AbstractValidator<UpdateProfileDto>
    {
        public UpdateProfileDtoValidator()
        {
            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("Ad alanı boş bırakılamaz.")
                .MaximumLength(50).WithMessage("Ad alanı en fazla 50 karakter olabilir.");

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Soyad alanı boş bırakılamaz.")
                .MaximumLength(50).WithMessage("Soyad alanı en fazla 50 karakter olabilir.");

            RuleFor(x => x.PhoneNumber)
                .NotEmpty().WithMessage("Telefon alanı boş bırakılamaz.")
                .Length(10).WithMessage("Telefon numaranız tam olarak 10 haneli olmalıdır.")
                .Matches(@"^5\d{9}$").WithMessage("Telefon numaranız 5 ile başlayan 10 haneli bir numara olmalıdır (Örn: 5XXXXXXXXX).");
        }
    }
}