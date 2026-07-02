using Application.DTOs.Comment;
using FluentValidation;

namespace SirenStore.Application.Validators
{
    public class CommentCreateDtoValidator : AbstractValidator<CommentCreateDto>
    {
        public CommentCreateDtoValidator()
        {
            RuleFor(x => x.Text)
                .NotEmpty().WithMessage("Yorum metni boş bırakılamaz.")
                .MaximumLength(1000).WithMessage("Yorum metni en fazla 1000 karakter olabilir.");

            RuleFor(x => x.Rating)
                .InclusiveBetween(1, 5).WithMessage("Puan 1 ile 5 arasında olmalıdır.");

            RuleFor(x => x.ProductId)
                .GreaterThan(0).WithMessage("Lütfen geçerli bir ürün seçiniz.");
        }
    }
}
