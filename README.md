# SirenStore — Proje Bağlam Dosyası

> Bu dosya, projeye yeni katılan bir stajyer veya geliştirici için hazırlanmıştır.  
> Başka bir yapay zekaya (ChatGPT, Claude vb.) bağlam olarak verilebilir; dosyanın sonundaki **Yapay Zeka Talimatı** bölümüne bakınız.

---

## 1. Proje Özeti

SirenStore, çok-satıcılı (multi-vendor) bir e-ticaret platformudur. Üç farklı kullanıcı tipi birbirinden bağımsız işlemler yapabilir:

- **Müşteri (Customer):** Ürünleri listeler, sepete ekler, sipariş verir, yorum yapar.
- **Satıcı (Seller):** Kendi mağaza sayfasına sahiptir, ürün ekler/günceller/siler, gelen siparişleri görür ve sipariş durumunu günceller.
- **Admin:** Kullanıcıları ve satıcı başvurularını yönetir, kategorileri düzenler, sistem loglarını (AuditLog, LoginHistory, ExceptionLog) inceler.

### Temel İş Akışı

```
Kullanıcı Kaydı
    → E-posta Doğrulama (6 haneli kod)
        → Giriş (JWT Access Token + Refresh Token)
            ↓
    [Müşteri]                   [Admin]
    Ürün Listele                Satıcı başvurularını onayla/reddet
    Sepete Ekle                 Kullanıcıları ban/unban
    Sipariş Ver                 Kategori ekle/sil
    Siparişleri Görüntüle       Sistem loglarını incele
    Yorum Yap
            ↓
    [Satıcı Başvurusu]
    Customer → "Satıcı Ol" başvurusu
    Admin onaylarsa UserType = Seller
    Seller: Ürün ekler, siparişleri yönetir
```

Proje arka planda PostgreSQL veritabanını kullanır; tüm silme işlemleri **soft-delete** (gerçek silme değil, `is_deleted = true` işaretleme) ile yapılır.

---

## 2. Teknoloji Yığını

### Backend

| Teknoloji | Sürüm | Neden Kullanılıyor? |
|---|---|---|
| **.NET 9 / ASP.NET Core Web API** | 9.x | Backend'in omurgası. HTTP isteklerini karşılar, JSON döner. |
| **C#** | 13 | Backend'in yazıldığı dil. |
| **Entity Framework Core** | 9.x | ORM (Object-Relational Mapper). C# sınıflarını veritabanı tablolarına çevirir; SQL yazmadan sorgu yapılmasını sağlar. |
| **PostgreSQL** | — | Ana veritabanı. Tüm veriler burada saklanır. |
| **JWT (JSON Web Token)** | — | Kimlik doğrulama. Kullanıcı giriş yaptığında bir token alır; her istekte bu token'ı gönderir. |
| **BCrypt.Net** | — | Şifre hashleme kütüphanesi. Şifreler asla düz metin olarak saklanmaz. |
| **FluentValidation** | — | Gelen DTO verilerini kurallara göre doğrular (boş alan, max uzunluk, vb.). |
| **AutoMapper** | — | Entity ↔ DTO dönüşümlerini otomatik yapar. Tekrarlayan atama kodunu ortadan kaldırır. |
| **MailKit / MimeKit** | — | E-posta gönderme kütüphanesi. E-posta doğrulama kodları bu kütüphane ile gönderilir. |
| **dotenv.net** | — | `.env` dosyasındaki gizli konfigürasyonları (DB şifresi, JWT secret, SMTP) programa yükler. |

### Frontend

| Teknoloji | Sürüm | Neden Kullanılıyor? |
|---|---|---|
| **Angular** | 19 | Frontend framework. Tek sayfalık uygulama (SPA) oluşturur. |
| **TypeScript** | ~5.7 | Angular'ın yazıldığı dil. JavaScript'in tip güvenli versiyonu. |
| **Tailwind CSS** | v4 | Utility-first CSS framework. `class="text-zinc-950 font-bold"` gibi sınıflarla stil verilir. |
| **RxJS** | ~7.8 | Reaktif programlama. Asenkron veri akışları (Observable, BehaviorSubject) için kullanılır. |
| **Lucide Angular** | — | İkon kütüphanesi. |

---

## 3. Klasör Mimarisi

Proje **Clean Architecture** (Temiz Mimari) anlayışıyla katmanlara ayrılmıştır. Her katmanın tek bir sorumluluğu vardır.

```
SirenStoreWebApp/
├── Entities/               ← 1. Katman: Sadece veritabanı modelleri
│   ├── Models/             ← C# sınıfları = veritabanı tabloları
│   └── Enums/              ← Sabit değer kümeleri (UserTypes, OrderStatus…)
│
├── Application/            ← 2. Katman: İş mantığı (business logic)
│   ├── DTOs/               ← Data Transfer Objects: API'ye gelen/giden veri kalıpları
│   ├── Interfaces/         ← Sözleşmeler (kontratlar): servis ve repository ne yapmalı?
│   ├── Services/           ← İş mantığının gerçek implementasyonu
│   ├── Validators/         ← FluentValidation kuralları (girdi doğrulama)
│   ├── Mapping/            ← AutoMapper profili (Entity ↔ DTO dönüşümleri)
│   └── Exceptions/         ← Özel hata sınıfları
│
├── Infrastructure/         ← 3. Katman: Veritabanı ve dış servis bağlantıları
│   ├── Context/            ← ApplicationDbContext: EF Core veritabanı bağlamı
│   ├── Repositories/       ← Generic Repository implementasyonu
│   ├── Configurations/     ← EF Core tablo yapılandırmaları (ilişkiler, kısıtlamalar)
│   ├── Services/           ← EmailService gibi dış servis implementasyonları
│   └── Migrations/         ← EF Core migration dosyaları (DB şema geçmişi)
│
├── WebAPI/                 ← 4. Katman: HTTP katmanı, dışarıya açılan kapı
│   ├── Controllers/        ← Endpoint tanımları (route, HTTP method, yetki)
│   ├── Middleware/         ← HTTP isteklerini yakalayan ara yazılımlar
│   └── Program.cs          ← Uygulamanın başlangıç noktası, DI kayıtları
│
└── Frontend-Angular/       ← Angular SPA uygulaması
    └── src/app/
        ├── pages/          ← Sayfa bileşenleri (home, products, cart, admin-panel…)
        ├── components/     ← Yeniden kullanılabilir UI bileşenleri (button, input, modal…)
        ├── services/       ← Backend ile HTTP iletişimi kuran servisler
        ├── guards/         ← Route korumaları (auth.guard, role.guard)
        ├── interceptors/   ← Her HTTP isteğine JWT ekler, 401'de token yeniler
        ├── models/         ← TypeScript arayüzleri (API yanıt tipleri)
        └── pipes/          ← Angular pipe'ları (format-price.pipe.ts)
```

### Katmanlar Arası İletişim

```
İstek Gelir
    → Controller (WebAPI)
        → Service Interface (Application/Interfaces)
            → Service Implementation (Application/Services)
                → Repository Interface (Application/Interfaces)
                    → Repository Implementation (Infrastructure)
                        → Veritabanı (PostgreSQL)
```

Önemli kural: **Alt katmanlar üst katmanları tanımaz.** Örneğin `Application` katmanı `WebAPI`'yi bilmez; sadece interface'ler aracılığıyla konuşurlar.

---

## 4. Veritabanı ve Temel Entity'ler

### BaseModel — Tüm Tabloların Ortak Alanları

`Entities/Models/BaseModel.cs` dosyasında tanımlıdır. Her entity bu sınıftan türer:

```csharp
public class BaseModel
{
    public long Id { get; set; }          // Primary key (otomatik artan)
    public DateTime CreationDate { get; set; }  // Oluşturulma tarihi
    public DateTime? UpdatedDate { get; set; }  // Güncellenme tarihi
    public bool IsDeleted { get; set; }   // Soft-delete bayrağı (true = silinmiş sayılır)
}
```

> **Soft-Delete Nedir?** Kayıt fiziksel olarak silinmez; sadece `IsDeleted = true` yapılır. Repository `Remove()` çağrıldığında bunu yapar. Tüm sorgular `WHERE is_deleted = false` filtresi uygular.

### Ana Entity'ler ve İlişkileri

```
User (Kullanıcı)
 ├── UserType: Customer | Seller | Admin | SuperAdmin
 ├── IsEmailConfirmed: e-posta doğrulandı mı?
 ├── RefreshToken: JWT yenileme tokeni
 ├── → Seller (bir kullanıcının bir mağazası olabilir, 1-1)
 ├── → Address[] (birden fazla adresi olabilir, 1-N)
 ├── → LoginHistory[] (giriş geçmişleri)
 └── → Comment[] (yazdığı yorumlar)

Seller (Satıcı/Mağaza)
 ├── Status: Pending | Approved | Rejected
 ├── StoreName, TaxNumber, ContactEmail, SupportLine
 ├── → User (bağlı kullanıcı, N-1)
 └── → Product[] (mağazanın ürünleri, 1-N)

Product (Ürün)
 ├── Name, Description, Price, Stock
 ├── → Seller (satıcı, N-1)
 ├── → Category (kategori, N-1)
 ├── → ProductImage[] (ürün görselleri, 1-N)
 └── → Comment[] (ürün yorumları, 1-N)

ProductImage (Ürün Görseli)
 └── IsMain: true olan görsel, listede kapak fotoğrafı olarak gösterilir

Category (Kategori)
 └── → Product[] (kategorideki ürünler, 1-N)

Basket (Sepet)
 ├── → User (kimin sepeti, N-1)
 └── → BasketItem[] (sepet kalemleri, 1-N)

BasketItem (Sepet Kalemi)
 ├── Quantity: adet
 ├── → Basket (N-1)
 └── → Product (N-1)

Order (Sipariş)
 ├── TotalPrice: toplam fiyat (sipariş anında hesaplanıp kaydedilir)
 ├── Status: Received → Preparing → Shipped → Delivered | Cancelled
 ├── AddressTitle, ShippingAddress
 ├── → User (siparişi veren, N-1)
 └── → OrderItem[] (sipariş kalemleri, 1-N)

OrderItem (Sipariş Kalemi)
 ├── Price: ürünün sipariş ANINDAKİ fiyatı (ileride fiyat değişse bu etkilenmez)
 ├── Quantity: adet
 ├── Status: her kalem kendi statusuna sahip
 ├── → Order (N-1)
 └── → Product (N-1, nullable — ürün silinse bile sipariş geçmişi korunur)

Comment (Yorum)
 ├── Text: yorum metni
 ├── Rating: 1-5 arası yıldız puanı
 ├── → User (N-1)
 └── → Product (N-1)

AuditLog (Denetim Kaydı)
 ├── Action: "USER_LOGIN", "PRODUCT_CREATED", "ORDER_CREATED" gibi sabit metinler
 ├── EntityName: hangi tablo etkilendi ("User", "Product", "Order"…)
 └── EntityId: etkilenen kaydın ID'si

ExceptionLog (Hata Kaydı)
 ├── ExceptionType, Message, StackTrace
 └── RequestPath, RequestMethod: hatanın hangi endpoint'te olduğu

LoginHistory (Giriş Geçmişi)
 ├── IsSuccess: başarılı mı?
 ├── IpAddress, UserAgent
 └── FailureReason: başarısızsa nedeni
```

### Veritabanı Sütun Adlandırma

EF Core `ApplicationDbContext.cs` içinde tüm sütun isimleri otomatik olarak `PascalCase`'den `snake_case`'e çevrilir. Örneğin C#'ta `CreationDate` olan alan, PostgreSQL'de `creation_date` olarak saklanır.

---

## 5. Kodlama Standartları ve Kurallar

### Dependency Injection (Bağımlılık Enjeksiyonu)

Projede hiçbir sınıf kendi bağımlılığını `new` ile oluşturmaz. Tüm bağımlılıklar constructor üzerinden enjekte edilir ve `Program.cs`'de kayıt yapılır:

```csharp
// Program.cs'de kayıt
builder.Services.AddScoped<IProductService, ProductManager>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

// Servis sınıfında kullanım
public class ProductManager : IProductService
{
    private readonly IRepository<Product> _productRepository;

    public ProductManager(IRepository<Product> productRepository) // DI burada
    {
        _productRepository = productRepository;
    }
}
```

> **Neden?** Sınıfları birbirinden bağımsız tutar, test yazmayı kolaylaştırır, bağımlılıkları değiştirmeyi basitleştirir.

### Generic Repository Pattern

Her entity için ayrı repository yazmak yerine tek bir generic `IRepository<T>` interface'i vardır:

```csharp
IRepository<Product>   // Product için CRUD işlemleri
IRepository<User>      // User için CRUD işlemleri
// ... hepsi aynı metodları sunar
```

Temel metodlar: `GetByIdAsync`, `GetAllAsync`, `GetAsync(predicate)`, `AddAsync`, `Update`, `Remove` (soft-delete), `AnyAsync`, `AsQueryable`, `SaveChangesAsync`.

### DTO Katmanı (Data Transfer Objects)

**Entity** (veritabanı modeli) doğrudan API'ye döndürülmez; bunun yerine **DTO** kullanılır:

- `CreateProductDto` → ürün oluştururken gelen veri
- `UpdateProductDto` → ürün güncellerken gelen veri
- `ProductListDto` → API'den dönen ürün verisi (gereksiz alanlar olmadan)

Bu ayrım sayesinde veritabanı şeması ile API kontratı birbirinden bağımsız olur.

### FluentValidation

Her DTO için ayrı bir `Validator` sınıfı vardır (`Application/Validators/`). Kurallar ihlal edildiğinde `ValidationException` fırlatılır ve Program.cs'deki global exception handler bunu otomatik olarak `400 Bad Request` yanıtına çevirir:

```csharp
public class CreateProductDtoValidator : AbstractValidator<CreateProductDto>
{
    public CreateProductDtoValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150);
        RuleFor(x => x.Price).GreaterThan(0);
    }
}
```

### AutoMapper

`Application/Mapping/MappingProfile.cs` dosyasında entity-DTO dönüşümleri tanımlanır. Özel dönüşümler için `.ForMember()` kullanılır:

```csharp
CreateMap<BasketItem, BasketItemDto>()
    .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name));
```

### Özel Exception Sınıfları

```
BusinessRuleException   → 422 Unprocessable Entity (iş kuralı ihlali)
NotFoundException       → 404 Not Found
ForbiddenException      → 403 Forbidden (yetki yok)
EmailNotConfirmedException → 403 Forbidden (e-posta doğrulanmamış)
```

Bunlar servis katmanında fırlatılır; `Program.cs`'deki global handler HTTP yanıtına çevirir. Controller içinde `try-catch` yazılmaz.

### JWT ve Yetkilendirme

Token içinde `ClaimTypes.NameIdentifier` (userId), `ClaimTypes.Email`, `ClaimTypes.Role` ve `FirstName`/`LastName` yer alır. Controller'larda userId token'dan çekilir:

```csharp
var userId = long.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
```

Endpoint güvenliği `[Authorize]` ve `[Authorize(Roles = "Seller")]` attribute'ları ile sağlanır.

### IDOR Koruması

Servis katmanı, işlem yapan kullanıcının gerçekten yetkili olduğunu kontrol eder. Örneğin bir satıcı ürün silerken `product.SellerId != seller.Id` kontrolü yapılır — token'daki userId ile hedef kaydın sahipliği eşleşmiyorsa hata fırlatılır.

### Transaction Kullanımı

Sipariş oluşturma gibi birden fazla tablo etkileyen kritik işlemlerde `BeginTransactionAsync` / `CommitAsync` / `RollbackAsync` kullanılır. Bir adım başarısız olursa tüm değişiklikler geri alınır.

### AuditLog

Tüm önemli işlemler (`USER_LOGIN`, `PRODUCT_CREATED`, `ORDER_CREATED`, `BASKET_ITEM_ADDED` vb.) `IAuditLogService.LogAuditAsync()` çağrısıyla veritabanına kaydedilir. Yeni bir iş akışı eklerken ilgili adımdan sonra audit log çağrısı eklenmesi beklenir.

### İsimlendirme Kuralları

| Kategori | Kural | Örnek |
|---|---|---|
| C# Sınıfları | PascalCase | `ProductManager`, `CreateProductDto` |
| C# Alanları | _camelCase (private) | `_productRepository` |
| Interface'ler | `I` öneki | `IProductService`, `IRepository<T>` |
| Service isimleri | `Manager` son eki | `ProductManager`, `AuthManager` |
| Özel servisler | `Service` son eki | `AuditLogService`, `EmailService` |
| DTO isimleri | İşlem + `Dto` | `CreateProductDto`, `UpdateProfileDto` |
| PostgreSQL sütunlar | snake_case | `creation_date`, `seller_id` |
| Angular bileşenler | kebab-case klasör + PascalCase sınıf | `product-card/` → `ProductCardComponent` |
| Angular servisleri | camelCase | `authService`, `cartService` |

### Frontend Mimarisi (Angular)

- **Standalone Components:** Angular 19'un özelliği; her bileşen kendi `imports` dizisini bildirir, NgModule kullanılmaz.
- **Lazy Loading:** Tüm route'lar `loadComponent()` ile yüklenir; başlangıçta sadece gerekli kod yüklenir.
- **State Management:** `BehaviorSubject` ile basit reaktif state. `AuthService` kullanıcı bilgisini tutar; bileşenler `user$` observable'ını subscribe eder.
- **HTTP Interceptor:** `api.interceptor.ts` her isteğe `Authorization: Bearer <token>` header'ı ekler. 401 gelirse refresh token ile yeni token alır; bu da başarısız olursa kullanıcıyı çıkış yapar.
- **Guard'lar:** `auth.guard.ts` oturum gerektiren sayfalara, `role.guard.ts` rol gerektiren sayfalara (Admin, Seller) erişimi kontrol eder.

---

## 6. API Endpoint Özeti

| Controller | Endpoint | Yetki | Açıklama |
|---|---|---|---|
| **Auth** | `POST /api/auth/register` | Herkese açık | Kayıt |
| | `POST /api/auth/login` | Herkese açık | Giriş → JWT döner |
| | `POST /api/auth/refresh` | Herkese açık | Token yenileme |
| | `POST /api/auth/verify-email` | Herkese açık | E-posta doğrulama |
| | `POST /api/auth/resend-verification-email` | Herkese açık | Doğrulama kodunu yeniden gönder |
| **Products** | `GET /api/products` | Herkese açık | Tüm ürünler |
| | `GET /api/products/{id}` | Herkese açık | Ürün detayı |
| | `GET /api/products/category/{id}` | Herkese açık | Kategoriye göre ürünler |
| | `GET /api/products/my-products` | Seller | Kendi ürünleri |
| | `POST /api/products` | Seller | Ürün oluştur |
| | `PUT /api/products` | Seller | Ürün güncelle |
| | `DELETE /api/products/{id}` | Seller | Ürün sil |
| **Sellers** | `GET /api/sellers/{id}/profile` | Herkese açık | Satıcı profili |
| | `POST /api/sellers/apply` | Giriş yapmış | Satıcı başvurusu |
| | `GET /api/sellers/my-status` | Giriş yapmış | Başvuru durumu |
| | `POST /api/sellers/approve/{id}` | Admin | Başvuru onayla |
| | `POST /api/sellers/reject/{id}` | Admin | Başvuru reddet |
| **Baskets** | `GET /api/baskets` | Giriş yapmış | Sepeti getir |
| | `POST /api/baskets` | Giriş yapmış | Sepete ürün ekle |
| | `PUT /api/baskets` | Giriş yapmış | Sepet adedi güncelle |
| | `DELETE /api/baskets/{productId}` | Giriş yapmış | Sepetten ürün çıkar |
| | `DELETE /api/baskets/clear` | Giriş yapmış | Sepeti temizle |
| **Orders** | `POST /api/orders` | Giriş yapmış | Sipariş oluştur (transaction) |
| | `GET /api/orders` | Giriş yapmış | Kendi siparişleri |
| | `GET /api/orders/seller` | Seller | Mağazaya gelen siparişler |
| | `GET /api/orders/{id}` | Giriş yapmış | Sipariş detayı |
| | `PUT /api/orders/items/{id}/status` | Admin / Seller | Sipariş durumu güncelle |
| **Categories** | `GET /api/categories` | Herkese açık | Kategoriler |
| | `POST /api/categories` | Admin | Kategori ekle |
| | `PUT /api/categories` | Admin | Kategori güncelle |
| | `DELETE /api/categories/{id}` | Admin | Kategori sil |
| **Customer** | `GET /api/customer/profile` | Giriş yapmış | Profil bilgisi |
| | `PUT /api/customer/profile` | Giriş yapmış | Profil güncelle |
| | `PUT /api/customer/change-password` | Giriş yapmış | Şifre değiştir |
| **Comments** | `GET /api/comments/product/{id}` | Herkese açık | Ürün yorumları |
| | `POST /api/comments` | Giriş yapmış | Yorum ekle |
| | `PUT /api/comments/{id}` | Giriş yapmış | Yorum güncelle |
| | `DELETE /api/comments/{id}` | Giriş yapmış | Yorum sil |
| **Admin** | `GET /api/admin/users` | Admin | Tüm kullanıcılar |
| | `GET /api/admin/sellers` | Admin | Tüm satıcılar |
| | `POST /api/admin/users/{id}/ban` | Admin | Kullanıcı banla |
| | `POST /api/admin/users/{id}/unban` | Admin | Ban kaldır |
| | `GET /api/admin/audit-logs` | Admin | İşlem logları |
| | `GET /api/admin/login-histories` | Admin | Giriş geçmişleri |

---

## 7. Yapay Zeka Talimatı (Prompt Template)

Aşağıdaki metni bu dosyayla birlikte herhangi bir yapay zekaya (ChatGPT, Claude vb.) verebilirsiniz:

---

> Ekte üzerinde çalıştığım e-ticaret projesinin mimari ve bağlam dosyası bulunuyor. Ben bu projede yeniyim ve öğrenme aşamasındayım. Sana soracağım soruları, isteyeceğim kodları veya yapmam gereken görevleri buradaki mimariye, teknolojilere ve klasör yapısına kesinlikle sadık kalarak cevapla. Bana sadece kodu verip geçme; bilmediğim yerleri, kodun nasıl çalıştığını ve projenin neresine entegre etmem gerektiğini adım adım açıklayarak öğret.
