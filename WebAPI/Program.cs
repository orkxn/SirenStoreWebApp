using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using SirenStore.Application.Interfaces;
using Entities.Models;
using SirenStore.Application.Mapping;
using SirenStore.Application.Services;
using SirenStore.Application.Validators;
using SirenStore.Infrastructure.Context;
using SirenStore.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// 1. VERİ TABANI AYARI (EF CORE & POSTGRESQL)
var connectionString = builder.Configuration.GetConnectionString("PostgreSQLConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// 2. REPOSITORY & SERVICE KAYITLARI (DEPENDENCY INJECTION)
// Generic Repository kaydı
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

// Bizim yazdığımız Manager servislerinin kaydı
builder.Services.AddScoped<IAdminService, AdminManager>();
builder.Services.AddScoped<IProductService, ProductManager>();
builder.Services.AddScoped<ISellerService, SellerManager>();

// 3. AUTOMAPPER & FLUENTVALIDATION ENTEGRASYONLARI
// AutoMapper profillerimizi tara ve hafızaya yükle
// Projedeki tüm MappingProfile sınıflarını otomatik bulur ve hatasız yükler
builder.Services.AddSingleton<IMapper>(provider =>
{
    // .NET'in kendi içindeki entegre LoggerFactory servisini çekiyoruz
    var loggerFactory = provider.GetRequiredService<ILoggerFactory>();

    var config = new AutoMapper.MapperConfiguration(cfg =>
    {
        cfg.AddProfile<SirenStore.Application.Mapping.MappingProfile>();
    }, loggerFactory);

    return new AutoMapper.Mapper(config);
});

// Validator'ları Application katmanından bul ve otomatik yükle
builder.Services.AddValidatorsFromAssemblyContaining<CreateProductValidator>();

// 4. KONTROLLER VE SWAGGER GÜVENLİK AYARLARI
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // JSON dönüşümlerinde sonsuz döngüye girilmesini (Object Cycle) engeller
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// GLOBAL EXCEPTION HANDLING MIDDLEWARE
// Tüm Application katmanı exception'larını tek bir noktada yakalayıp doğru HTTP yanıtına çeviren middleware
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var exceptionFeature = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>();
        var exception = exceptionFeature?.Error;

        context.Response.ContentType = "application/json";

        var (statusCode, response) = exception switch
        {
            FluentValidation.ValidationException valEx => (
                StatusCodes.Status400BadRequest,
                new
                {
                    Type = "ValidationError",
                    Errors = valEx.Errors.Select(e => new { e.PropertyName, e.ErrorMessage })
                } as object
            ),
            SirenStore.Application.Exceptions.NotFoundException notFoundEx => (
                StatusCodes.Status404NotFound,
                new { Type = "NotFound", Message = notFoundEx.Message } as object
            ),
            SirenStore.Application.Exceptions.BusinessRuleException businessEx => (
                StatusCodes.Status422UnprocessableEntity,
                new { Type = "BusinessRuleViolation", Message = businessEx.Message } as object
            ),
            _ => (
                StatusCodes.Status500InternalServerError,
                new { Type = "UnexpectedError", Message = "Beklenmeyen bir hata oluştu." } as object
            )
        };

        context.Response.StatusCode = statusCode;
        await context.Response.WriteAsJsonAsync(response);
    });
});

// HTTP İstek Hattı Yapılandırması (Middleware Pipeline)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Angular istek atabilsin diye CORS politikası (İleride burayı esneteceğiz)
app.UseCors(opt => opt.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());

app.UseAuthorization();

app.MapControllers();

app.Run();