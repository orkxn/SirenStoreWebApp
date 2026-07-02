using Application.DTOs.Comment;
using FluentValidation;

namespace SirenStore.Application.Validators
{
    public class CommentUpdateDtoValidator : AbstractValidator<CommentUpdateDto>
    {
        public CommentUpdateDtoValidator()
        {
            RuleFor(x => x.Text)
                .NotEmpty().WithMessage("Yorum metni boş bırakılamaz.")
                .MaximumLength(1000).WithMessage("Yorum metni en fazla 1000 karakter olabilir.");

            RuleFor(x => x.Rating)
                .InclusiveBetween(1, 5).WithMessage("Puan 1 ile 5 arasında olmalıdır.");
        }
    }
}
