# Siren Store Mobile (Flutter)

Siren Store e-ticaret uygulamasının Flutter kullanılarak geliştirilmiş mobil uygulaması.

---

## 🚀 Proje Yapısı

- `lib/config/api_config.dart`: Backend API (AspNetCore WebAPI) bağlantı adresi ve Android Emulator IP yönlendirmesi (`http://10.0.2.2:5063/api`).
- `lib/models/product.dart`: Ürün veri modeli (DTO eşleştirmesi).
- `lib/services/api_service.dart`: Backend REST API istekleri (Ürün listeleme, Arama, JWT yetkilendirme).
- `lib/screens/home_screen.dart`: Mobil ürün kataloğu ve arama ekranı.
- `lib/main.dart`: Uygulama başlangıç noktası (Material 3 tema desteği).

---

## 🛠️ Kurulum ve Çalıştırma

### 1. Flutter SDK Kurulumu (Eğer sisteminizde yüklü değilse)
1. [Flutter Resmi İndirme Sayfası](https://docs.flutter.dev/get-started/install/windows/desktop)'ndan Flutter SDK'yı indirin.
2. Zip dosyasını `C:\flutter` klasörüne çıkarın.
3. Windows Ortam Değişkenleri (PATH) kısmına `C:\flutter\bin` yolunu ekleyin.
4. Komut satırında `flutter doctor` çalıştırarak kurulumu doğrulayın.

### 2. Bağımlılıkları Yükleme
Mobil klasörüne gidin ve paketleri indirin:
```bash
cd mobile
flutter pub get
```

### 3. Backend API'yi Başlatma
Mobil uygulamanın verileri alabilmesi için backend WebAPI servisinin çalışıyor olması gerekmektedir:
```bash
# Proje kök dizininde veya backend/WebAPI klasöründe:
dotnet run --project backend/WebAPI
```

### 4. Mobil Uygulamayı Çalıştırma
Android Emulator veya iOS Simulator başlatıldıktan sonra:
```bash
cd mobile
flutter run
```

---

## 💡 Alternatif 2: WebView ile Angular Web Uygulamasını Mobil Uygulamaya Çevirme

Eğer mevcut Angular web uygulamasını doğrudan mobil uygulama içinde göstermek isterseniz (WebView wrapper yöntemi):
1. `pubspec.yaml` dosyasına `webview_flutter: ^4.7.0` ekleyin.
2. Web sürümünü yayınladığınız adresi (örneğin `http://localhost:4200`) `WebViewWidget` içinde çağırın.
