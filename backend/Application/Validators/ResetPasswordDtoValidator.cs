using FluentValidation;
using SirenStore.Application.DTOs;

namespace SirenStore.Application.Validators
{
    public class ResetPasswordDtoValidator : AbstractValidator<ResetPasswordDto>
    {
        public ResetPasswordDtoValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("E-posta adresi boş bırakılamaz.")
                .EmailAddress().WithMessage("Lütfen geçerli bir e-posta adresi giriniz.");

            RuleFor(x => x.Token)
                .NotEmpty().WithMessage("Şifre sıfırlama token'ı boş bırakılamaz.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Şifre alanı boş bırakılamaz.")
                .MinimumLength(6).WithMessage("Şifre en az 6 karakter olmalıdır.");

            RuleFor(x => x.ConfirmPassword)
                .NotEmpty().WithMessage("Şifre onay alanı boş bırakılamaz.")
                .Equal(x => x.Password).WithMessage("Şifreler uyuşmuyor.");
        }
    }
}
