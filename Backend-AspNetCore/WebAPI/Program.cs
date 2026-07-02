using AutoMapper;
using dotenv.net;
using Entities.Models;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SirenStore.Application.Mapping;
using SirenStore.Application.Services;
using SirenStore.Application.Validators;
using SirenStore.Infrastructure.Context;
using SirenStore.WebAPI.Middleware;
using System.Text;

// .env dosyasını program.cs içine yükler
DotEnv.Load();

var builder = WebApplication.CreateBuilder(args);

// veri tabanı connection string bağlantısı
var connectionString = builder.Configuration.GetConnectionString("PostgreSQLConnection");
builder.Services.AddDbContextPool<DbContext, ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// service kayıtları, dependecy injection
builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<SellerService>();
builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped<BasketService>();
builder.Services.AddScoped<OrderService>();
builder.Services.AddScoped<CategoryService>();
builder.Services.AddScoped<AdminService>();
builder.Services.AddScoped<AuditLogService>();
builder.Services.AddScoped<LoginHistoryService>();
builder.Services.AddScoped<CommentService>();
builder.Services.AddScoped<FavoriteService>();

// automapper ve fluentvalidation kayıtları
builder.Services.AddAutoMapper(cfg => cfg.AddProfile<SirenStore.Application.Mapping.MappingProfile>());

builder.Services.AddValidatorsFromAssemblyContaining<CreateProductDtoValidator>();

// cors policy
builder.Services.AddCors(options =>
{
    var corsSettings = builder.Configuration.GetSection("CorsSettings");
    var allowedOrigins = corsSettings.GetSection("AllowedOrigins").Get<string[]>() ?? new[] { "http://localhost:4200" };
    var allowedMethods = corsSettings.GetSection("AllowedMethods").Get<string[]>() ?? new[] { "GET", "POST", "PUT", "DELETE" };
    var allowedHeaders = corsSettings.GetSection("AllowedHeaders").Get<string[]>() ?? new[] { "Content-Type", "Authorization" };
    var allowCredentials = corsSettings.GetValue<bool>("AllowCredentials");

    options.AddPolicy("SirenStorePolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .SetIsOriginAllowed(origin =>
              {
                  return Uri.TryCreate(origin, UriKind.Absolute, out var uri) &&
                         (uri.Host == "localhost" || uri.Host.EndsWith(".onrender.com"));
              })
              .WithMethods(allowedMethods)
              .WithHeaders(allowedHeaders);

        if (allowCredentials)
            policy.AllowCredentials();
    });
});

// jwt bearer configuration ayarları
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var secretKey = builder.Configuration["JwtSettings:SecretKey"];
    if (string.IsNullOrEmpty(secretKey) || secretKey.Length < 32)
    {
        throw new InvalidOperationException("JWT SecretKey is missing or too short. It must be at least 32 characters (256 bits). Please configure a strong key in appsettings.json or environment variables.");
    }

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero // Token süresi dolduğu anda geçersiz kılınır (5 dakikalık varsayılan tolerans payını kapatır)
    };
});

// controller ekleme ayarları
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

var app = builder.Build();

// exception loglama
app.UseMiddleware<ExceptionLoggingMiddleware>();

// exception handling mekanizması (global)
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
            UnauthorizedAccessException _ => (
                StatusCodes.Status401Unauthorized,
                new { Type = "Unauthorized", Message = "Geçerli kimlik bilgisi bulunamadı veya oturum açmanız gerekiyor." } as object
            ),
            SirenStore.Application.Exceptions.ForbiddenException forbiddenEx => (
                StatusCodes.Status403Forbidden,
                new { Type = "Forbidden", Message = forbiddenEx.Message } as object
            ),
            SirenStore.Application.Exceptions.NotFoundException notFoundEx => (
                StatusCodes.Status404NotFound,
                new { Type = "NotFound", Message = notFoundEx.Message } as object
            ),
            SirenStore.Application.Exceptions.EmailNotConfirmedException emailNotConfirmedEx => (
                StatusCodes.Status403Forbidden,
                new { Type = "EmailNotConfirmed", Message = emailNotConfirmedEx.Message, Email = emailNotConfirmedEx.Email } as object
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
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// cors policy uygulamaya geçirme
app.UseCors("SirenStorePolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();