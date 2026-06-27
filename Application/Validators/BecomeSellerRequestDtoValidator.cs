using FluentValidation;
using SirenStore.Application.DTOs;

namespace SirenStore.Application.Validators
{
    public class CreateSellerDtoValidator : AbstractValidator<CreateSellerDto>
    {
        public CreateSellerDtoValidator()
        {
            RuleFor(x => x.StoreName)
                .NotEmpty().WithMessage("Mağaza adı boş bırakılamaz.")
                .MinimumLength(3).WithMessage("Mağaza adı en az 3 karakter olmalıdır.")
                .MaximumLength(100).WithMessage("Mağaza adı en fazla 100 karakter olabilir.");

            RuleFor(x => x.ContactEmail)
                .NotEmpty().WithMessage("İletişim e-posta adresi boş bırakılamaz.")
                .EmailAddress().WithMessage("Geçerli bir e-posta adresi giriniz.");

            RuleFor(x => x.ContactPhone)
                .NotEmpty().WithMessage("İletişim telefon numarası boş bırakılamaz.")
                .Length(10).WithMessage("Telefon numaranız tam olarak 10 haneli olmalıdır.")
                .Matches(@"^5\d{9}$").WithMessage("Telefon numaranız 5 ile başlayan 10 haneli bir numara olmalıdır (Örn: 5XXXXXXXXX).");

            RuleFor(x => x.SupportLine)
                .NotEmpty().WithMessage("Destek hattı boş bırakılamaz.")
                .MaximumLength(20).WithMessage("Destek hattı en fazla 20 karakter olabilir.");

            RuleFor(x => x.TaxNumber)
                .NotEmpty().WithMessage("Vergi numarası boş bırakılamaz.")
                .Length(10).WithMessage("Vergi numarası tam olarak 10 haneli olmalıdır.")
                .Matches(@"^\d{10}$").WithMessage("Vergi numarası sadece rakamlardan oluşmalıdır.");

            RuleFor(x => x.TaxOffice)
                .NotEmpty().WithMessage("Vergi dairesi boş bırakılamaz.")
                .MaximumLength(100).WithMessage("Vergi dairesi adı en fazla 100 karakter olabilir.");
        }
    }
}