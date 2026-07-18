using Application.DTOs.Comment;
using FluentValidation;
using SirenStore.Application.DTOs;

namespace SirenStore.Application.Validators
{
    public class AddToBasketDtoValidator : AbstractValidator<AddToBasketDto>
    {
        public AddToBasketDtoValidator()
        {
            RuleFor(x => x.ProductId).GreaterThan(0).WithMessage("Lütfen geçerli bir ürün seçiniz.");
            RuleFor(x => x.Quantity).GreaterThan(0).WithMessage("Sepete en az 1 adet ürün eklemelisiniz.")
                .LessThanOrEqualTo(100).WithMessage("Tek seferde en fazla 100 adet ekleyebilirsiniz.");
        }
    }

    public class BecomeSellerRequestDtoValidator : AbstractValidator<CreateSellerDto>
    {
        public BecomeSellerRequestDtoValidator()
        {
            RuleFor(x => x.StoreName).NotEmpty().WithMessage("Mağaza adı boş bırakılamaz.")
                .Length(3, 100).WithMessage("Mağaza adı 3 ile 100 karakter arasında olmalıdır.");
            RuleFor(x => x.TaxNumber).NotEmpty().WithMessage("Vergi numarası boş bırakılamaz.")
                .Matches(@"^\d{10,11}$").WithMessage("Vergi numarası 10 veya 11 haneli rakamlardan oluşmalıdır.");
            RuleFor(x => x.ContactPhone).NotEmpty().WithMessage("Telefon numarası boş bırakılamaz.");
        }
    }

    public class ChangePasswordDtoValidator : AbstractValidator<ChangePasswordDto>
    {
        public ChangePasswordDtoValidator()
        {
            RuleFor(x => x.CurrentPassword).NotEmpty().WithMessage("Mevcut şifre boş bırakılamaz.");
            RuleFor(x => x.NewPassword).NotEmpty().WithMessage("Yeni şifre boş bırakılamaz.")
                .MinimumLength(6).WithMessage("Yeni şifre en az 6 karakter olmalıdır.");
        }
    }

    public class CommentCreateDtoValidator : AbstractValidator<CommentCreateDto>
    {
        public CommentCreateDtoValidator()
        {
            RuleFor(x => x.ProductId).GreaterThan(0).WithMessage("Geçersiz ürün ID.");
            RuleFor(x => x.Rating).InclusiveBetween(1, 5).WithMessage("Puan 1 ile 5 arasında olmalıdır.");
            RuleFor(x => x.Text).NotEmpty().WithMessage("Yorum metni boş bırakılamaz.")
                .MaximumLength(1000).WithMessage("Yorum en fazla 1000 karakter olabilir.");
        }
    }

    public class CommentUpdateDtoValidator : AbstractValidator<CommentUpdateDto>
    {
        public CommentUpdateDtoValidator()
        {
            RuleFor(x => x.Rating).InclusiveBetween(1, 5).WithMessage("Puan 1 ile 5 arasında olmalıdır.");
            RuleFor(x => x.Text).NotEmpty().WithMessage("Yorum metni boş bırakılamaz.")
                .MaximumLength(1000).WithMessage("Yorum en fazla 1000 karakter olabilir.");
        }
    }

    public class CreateOrderDtoValidator : AbstractValidator<CreateOrderDto>
    {
        public CreateOrderDtoValidator()
        {
            RuleFor(x => x.AddressTitle).NotEmpty().WithMessage("Adres başlığı boş bırakılamaz.");
            RuleFor(x => x.ShippingAddress).NotEmpty().WithMessage("Teslimat adresi boş bırakılamaz.");
        }
    }

    public class CreateProductDtoValidator : AbstractValidator<CreateProductDto>
    {
        public CreateProductDtoValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Ürün adı boş bırakılamaz.");
            RuleFor(x => x.Price).GreaterThan(0).WithMessage("Fiyat 0'dan büyük olmalıdır.");
            RuleFor(x => x.Stock).GreaterThanOrEqualTo(0).WithMessage("Stok negatif olamaz.");
            RuleFor(x => x.CategoryId).GreaterThan(0).WithMessage("Geçerli bir kategori seçiniz.");
        }
    }

    public class ForgotPasswordDtoValidator : AbstractValidator<ForgotPasswordDto>
    {
        public ForgotPasswordDtoValidator()
        {
            RuleFor(x => x.Email).NotEmpty().WithMessage("E-posta boş bırakılamaz.")
                .EmailAddress().WithMessage("Geçerli bir e-posta giriniz.");
        }
    }

    public class LoginDtoValidator : AbstractValidator<LoginDto>
    {
        public LoginDtoValidator()
        {
            RuleFor(x => x.Email).NotEmpty().WithMessage("E-posta boş bırakılamaz.")
                .EmailAddress().WithMessage("Geçerli bir e-posta adresi giriniz.");
            RuleFor(x => x.Password).NotEmpty().WithMessage("Şifre boş olamaz.");
        }
    }

    public class RegisterDtoValidator : AbstractValidator<RegisterDto>
    {
        public RegisterDtoValidator()
        {
            RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("Geçerli bir e-posta adresi giriniz.");
            RuleFor(x => x.Password).NotEmpty().MinimumLength(6).WithMessage("Şifre en az 6 karakter olmalıdır.");
            RuleFor(x => x.FirstName).NotEmpty().WithMessage("Ad boş bırakılamaz.");
            RuleFor(x => x.LastName).NotEmpty().WithMessage("Soyad boş bırakılamaz.");
        }
    }

    public class ResendVerificationEmailDtoValidator : AbstractValidator<ResendVerificationEmailDto>
    {
        public ResendVerificationEmailDtoValidator()
        {
            RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("Geçerli bir e-posta adresi giriniz.");
        }
    }

    public class ResetPasswordDtoValidator : AbstractValidator<ResetPasswordDto>
    {
        public ResetPasswordDtoValidator()
        {
            RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("Geçerli bir e-posta adresi giriniz.");
            RuleFor(x => x.Token).NotEmpty().WithMessage("Doğrulama kodu boş olamaz.");
            RuleFor(x => x.Password).NotEmpty().MinimumLength(6).WithMessage("Şifre en az 6 karakter olmalıdır.");
        }
    }

    public class UpdateProductDtoValidator : AbstractValidator<UpdateProductDto>
    {
        public UpdateProductDtoValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0).WithMessage("Geçersiz ürün ID.");
            RuleFor(x => x.Name).NotEmpty().WithMessage("Ürün adı boş bırakılamaz.");
            RuleFor(x => x.Price).GreaterThan(0).WithMessage("Fiyat 0'dan büyük olmalıdır.");
            RuleFor(x => x.Stock).GreaterThanOrEqualTo(0).WithMessage("Stok negatif olamaz.");
            RuleFor(x => x.CategoryId).GreaterThan(0).WithMessage("Geçerli bir kategori seçiniz.");
        }
    }

    public class UpdateProfileDtoValidator : AbstractValidator<UpdateProfileDto>
    {
        public UpdateProfileDtoValidator()
        {
            RuleFor(x => x.FirstName).NotEmpty().WithMessage("Ad boş bırakılamaz.");
            RuleFor(x => x.LastName).NotEmpty().WithMessage("Soyad boş bırakılamaz.");
        }
    }

    public class VerifyEmailDtoValidator : AbstractValidator<VerifyEmailDto>
    {
        public VerifyEmailDtoValidator()
        {
            RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("Geçerli bir e-posta giriniz.");
            RuleFor(x => x.Token).NotEmpty().WithMessage("Doğrulama kodu boş olamaz.");
        }
    }
}
