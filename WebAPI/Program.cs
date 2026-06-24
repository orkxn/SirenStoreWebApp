using AutoMapper;
using Entities.Models;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
// using Microsoft.OpenApi.Models; // removed to avoid dependency/version mismatch
using SirenStore.Application.Interfaces;
using SirenStore.Application.Mapping;
using SirenStore.Application.Services;
using SirenStore.Application.Validators;
using SirenStore.Infrastructure.Context;
using SirenStore.Infrastructure.Repositories;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1. VERİ TABANI AYARI (EF CORE & POSTGRESQL)
var connectionString = builder.Configuration.GetConnectionString("PostgreSQLConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// 2. REPOSITORY & SERVICE KAYITLARI (DEPENDENCY INJECTION)
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IAdminService, AdminManager>();
builder.Services.AddScoped<IProductService, ProductManager>();
builder.Services.AddScoped<ISellerService, SellerManager>();
builder.Services.AddScoped<IAuthService, AuthManager>();

// 3. AUTOMAPPER & FLUENTVALIDATION ENTEGRASYONLARI
builder.Services.AddSingleton<IMapper>(provider =>
{
    var loggerFactory = provider.GetRequiredService<ILoggerFactory>();
    var config = new AutoMapper.MapperConfiguration(cfg =>
    {
        cfg.AddProfile<SirenStore.Application.Mapping.MappingProfile>();
    }, loggerFactory);
    return new AutoMapper.Mapper(config);
});

builder.Services.AddValidatorsFromAssemblyContaining<CreateProductValidator>();

// 4. JWT KIMLIK DOGRULAMA (AUTHENTICATION) AYARLARI
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecretKey"]))
    };
});

// 5. KONTROLLER VE SWAGGER AYARLARI
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddEndpointsApiExplorer();

// Use default Swagger generation. If you need specific OpenAPI models (e.g. OpenApiInfo,
// security schemes) add a compatible Microsoft.OpenApi package or configure via
// custom operation filters. Kept minimal to avoid package version conflicts.
builder.Services.AddOpenApi(); // .NET 10 Yerleşik OpenAPI servisi

var app = builder.Build();

// GLOBAL EXCEPTION HANDLING MIDDLEWARE
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

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi(); // .NET 10 Yerleşik OpenAPI endpoint'ini açar
}

app.UseHttpsRedirection();

app.UseCors(opt => opt.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();