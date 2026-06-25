using FluentValidation;
using SirenStore.Application.DTOs;

namespace SirenStore.Application.Validators
{
    public class BecomeSellerRequestDtoValidator : AbstractValidator<BecomeSellerRequestDto>
    {
        public BecomeSellerRequestDtoValidator()
        {
            RuleFor(x => x.StoreName)
                .NotEmpty().WithMessage("Mağaza adı boş bırakılamaz.")
                .MinimumLength(3).WithMessage("Mağaza adı en az 3 karakter olmalıdır.")
                .MaximumLength(100).WithMessage("Mağaza adı en fazla 100 karakter olabilir.");

            RuleFor(x => x.TaxNumber)
                .NotEmpty().WithMessage("Vergi numarası boş bırakılamaz.")
                .Length(10).WithMessage("Vergi numarası tam 10 haneli olmalıdır.")
                .Matches(@"^[0-9]+$").WithMessage("Vergi numarası sadece rakamlardan oluşmalıdır.");

            RuleFor(x => x.TaxOffice)
                .NotEmpty().WithMessage("Vergi dairesi boş bırakılamaz.")
                .MaximumLength(50).WithMessage("Vergi dairesi adı en fazla 50 karakter olabilir.");
        }
    }
}