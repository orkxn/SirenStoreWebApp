# Siren Store

Siren Store is a modern, full-stack e-commerce web application built using .NET Core and Angular. It features a layered architecture for the backend and a component-based standalone architecture for the frontend.

Siren Store, .NET Core ve Angular kullanılarak geliştirilmiş modern bir full-stack e-ticaret web uygulamasıdır. Backend tarafında katmanlı bir mimari, frontend tarafında ise bileşen tabanlı standalone bir mimari kullanılmaktadır.

---

## English Version

### Project Architecture

The project is divided into two main parts:

1. Backend (AspNetCore)
- Entities: Contains database models and enumeration definitions.
- Application: Contains interfaces, DTOs, business logic services, exception classes, validation rules, and mapping profiles.
- Infrastructure: Contains repository implementations, database configurations, migrations, DbContext, and services like EmailService.
- WebAPI: Serves the REST API endpoints and manages configurations, environment variables, middlewares, and controllers.

2. Frontend (Angular)
- Developed using Angular 19 (Standalone Components).
- Managed with Services, Interceptors, Guards, and Pipes.
- Designed with high-quality CSS styling and glassmorphism.

### Features

- Product catalog, listing, and search.
- User registration, login, and secure JWT-based authentication.
- Email verification and password reset flows (Forgot & Reset Password).
- Cart management (add, update, remove items, auto-calculating total).
- Checkout and order placement.
- Saved address selection and address deletion from past orders.
- Product favorites (toggle likes and list favorites).
- Audit logging of all critical system actions.

### Prerequisites

- .NET 10.0 SDK
- Node.js (v18 or higher) and npm
- PostgreSQL database

### Installation and Running

#### 1. Backend Setup

Navigate to the backend directory:
```bash
cd Backend-AspNetCore
```

Create a file named `.env` inside the `WebAPI` directory and define your PostgreSQL connection string and SMTP settings. For example:
```env
ConnectionStrings__PostgreSQLConnection="Host=localhost;Database=SirenStoreDb;Username=postgres;Password=yourpassword"
AppSettings__ClientUrl="http://localhost:4200"
```

Apply database migrations to create the database schema:
```bash
dotnet ef database update --project Infrastructure --startup-project WebAPI
```

Run the backend application:
```bash
cd WebAPI
dotnet run
```
The backend API will start running at `https://localhost:7009` or `http://localhost:5290`.

#### 2. Frontend Setup

Navigate to the frontend directory:
```bash
cd Frontend-Angular
```

Install the dependencies:
```bash
npm install
```

Run the development server:
```bash
npm start
```
Open your browser and navigate to `http://localhost:4200`.

---

## Türkçe Versiyon

### Proje Mimarisi

Proje iki ana bölümden oluşmaktadır:

1. Backend (AspNetCore)
- Entities: Veritabanı modellerini ve enum tanımlarını içerir.
- Application: Arayüzler, DTO'lar, iş mantığı servisleri, özel hata sınıfları, FluentValidation kuralları ve mapping profillerini içerir.
- Infrastructure: Depo (Repository) uygulamaları, veritabanı konfigürasyonları, migration dosyaları, DbContext ve EmailService gibi altyapı servislerini içerir.
- WebAPI: REST API endpoint'lerini sunar ve konfigürasyonları, çevre değişkenlerini, middleware'leri ve controller'ları yönetir.

2. Frontend (Angular)
- Angular 19 (Standalone Components) kullanılarak geliştirilmiştir.
- Servisler, Interceptor'lar, Guard'lar ve Pipe'lar ile yönetilmektedir.
- Premium CSS tasarımları ve cam efekti (glassmorphism) ile dizayn edilmiştir.

### Özellikler

- Ürün kataloğu, listeleme ve arama.
- Kullanıcı kaydı, girişi ve JWT tabanlı güvenli kimlik doğrulama.
- E-posta doğrulama ve şifre sıfırlama akışları (Şifremi Unuttum & Şifre Yenileme).
- Sepet yönetimi (ürün ekleme, adet güncelleme, silme ve sepet tutarı hesaplama).
- Ödeme adımı ve sipariş oluşturma.
- Kayıtlı adres seçimi ve geçmiş siparişlerden adres silme özelliği.
- Ürün favorileme (beğenme ve favorileri listeleme).
- Kritik sistem işlemlerinin audit logları ile izlenmesi.

### Gereksinimler

- .NET 10.0 SDK
- Node.js (v18 veya üzeri) ve npm
- PostgreSQL veritabanı

### Kurulum ve Çalıştırma

#### 1. Backend Kurulumu

Backend dizinine geçiş yapın:
```bash
cd Backend-AspNetCore
```

`WebAPI` dizini içinde `.env` adında bir dosya oluşturun ve PostgreSQL bağlantı dizesi ile SMTP ayarlarını tanımlayın. Örnek:
```env
ConnectionStrings__PostgreSQLConnection="Host=localhost;Database=SirenStoreDb;Username=postgres;Password=sifreniz"
AppSettings__ClientUrl="http://localhost:4200"
```

Veritabanı tablolarını oluşturmak için migration'ları uygulayın:
```bash
dotnet ef database update --project Infrastructure --startup-project WebAPI
```

Backend uygulamasını çalıştırın:
```bash
cd WebAPI
dotnet run
```
Backend API `https://localhost:7009` veya `http://localhost:5290` adresinde çalışmaya başlayacaktır.

#### 2. Frontend Kurulumu

Frontend dizinine geçiş yapın:
```bash
cd Frontend-Angular
```

Gerekli paketleri yükleyin:
```bash
npm install
```

Geliştirme sunucusunu başlatın:
```bash
npm start
```
Tarayıcınızı açın ve `http://localhost:4200` adresine gidin.
