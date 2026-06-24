using FluentValidation;
using SirenStore.Application.DTOs;

namespace SirenStore.Application.Validators
{
    public class ChangePasswordDtoValidator : AbstractValidator<ChangePasswordDto>
    {
        public ChangePasswordDtoValidator()
        {
            RuleFor(x => x.CurrentPassword)
                .NotEmpty().WithMessage("Mevcut şifreniz boş bırakılamaz.");

            RuleFor(x => x.NewPassword)
                .NotEmpty().WithMessage("Yeni şifre alanı boş bırakılamaz.")
                .MinimumLength(6).WithMessage("Yeni şifreniz en az 6 karakter olmalıdır.")
                .Matches(@"[A-Z]").WithMessage("Yeni şifre en az bir büyük harf içermelidir.")
                .Matches(@"[0-9]").WithMessage("Yeni şifre en az bir rakam içermelidir.");

            RuleFor(x => x.ConfirmNewPassword)
                .NotEmpty().WithMessage("Yeni şifre tekrar alanı boş bırakılamaz.")
                .Equal(x => x.NewPassword).WithMessage("Yeni şifreler birbiriyle eşleşmiyor!");
        }
    }
}