import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import 'package:siren_store_mobile/config/api_config.dart';
import 'package:siren_store_mobile/models/product.dart';
import 'package:siren_store_mobile/models/category.dart';
import 'package:siren_store_mobile/models/basket.dart';
import 'package:siren_store_mobile/models/order.dart';
import 'package:siren_store_mobile/models/comment.dart';
import 'package:siren_store_mobile/models/user_profile.dart';
import 'package:siren_store_mobile/models/seller.dart';
import 'package:siren_store_mobile/models/admin.dart';

class ApiService {
  // Token management
  static String? _inMemoryToken;

  static Future<String?> getToken() async {
    if (_inMemoryToken != null) return _inMemoryToken;
    try {
      final prefs = await SharedPreferences.getInstance();
      _inMemoryToken = prefs.getString('access_token');
      return _inMemoryToken;
    } catch (_) {
      return null;
    }
  }

  static Future<void> setToken(String token) async {
    _inMemoryToken = token;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('access_token', token);
  }

  static Future<void> logout() async {
    _inMemoryToken = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('access_token');
  }

  static Future<Map<String, String>> _headers({bool needsAuth = true}) async {
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (needsAuth) {
      final token = await getToken();
      if (token != null && token.isNotEmpty) {
        headers['Authorization'] = 'Bearer $token';
      }
    }
    return headers;
  }

  // ================= AuthController =================
  static Future<bool> login(String email, String password) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/auth/login');
    final res = await http.post(
      uri,
      headers: await _headers(needsAuth: false),
      body: json.encode({'email': email, 'password': password}),
    );
    if (res.statusCode == 200) {
      final data = json.decode(res.body);
      final token = data['accessToken'];
      if (token != null) {
        await setToken(token);
        return true;
      }
    }
    return false;
  }

  static Future<String> register(String firstName, String lastName, String email, String password, String phoneNumber) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/auth/register');
    final res = await http.post(
      uri,
      headers: await _headers(needsAuth: false),
      body: json.encode({
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'password': password,
        'phoneNumber': phoneNumber,
      }),
    );
    final data = json.decode(res.body);
    if (res.statusCode == 201 || res.statusCode == 200) {
      return data['message'] ?? 'Kayıt başarılı.';
    }
    throw Exception(data['message'] ?? 'Kayıt başarısız.');
  }

  static Future<void> verifyEmail(String email, String token) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/auth/verify-email');
    final res = await http.post(
      uri,
      headers: await _headers(needsAuth: false),
      body: json.encode({'email': email, 'token': token}),
    );
    if (res.statusCode != 200) {
      final data = json.decode(res.body);
      throw Exception(data['message'] ?? 'E-posta doğrulama başarısız.');
    }
  }

  static Future<void> resendVerificationEmail(String email) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/auth/resend-verification-email');
    final res = await http.post(
      uri,
      headers: await _headers(needsAuth: false),
      body: json.encode({'email': email}),
    );
    if (res.statusCode != 200) {
      final data = json.decode(res.body);
      throw Exception(data['message'] ?? 'İşlem başarısız.');
    }
  }

  static Future<void> forgotPassword(String email) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/auth/forgot-password');
    final res = await http.post(
      uri,
      headers: await _headers(needsAuth: false),
      body: json.encode({'email': email}),
    );
    if (res.statusCode != 200) {
      final data = json.decode(res.body);
      throw Exception(data['message'] ?? 'İşlem başarısız.');
    }
  }

  static Future<void> resetPassword(String email, String token, String password, String confirmPassword) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/auth/reset-password');
    final res = await http.post(
      uri,
      headers: await _headers(needsAuth: false),
      body: json.encode({
        'email': email,
        'token': token,
        'password': password,
        'confirmPassword': confirmPassword,
      }),
    );
    if (res.statusCode != 200) {
      final data = json.decode(res.body);
      throw Exception(data['message'] ?? 'Şifre sıfırlama başarısız.');
    }
  }

  // ================= ProductsController =================
  static Future<List<Product>> getProducts({
    int page = 1,
    int pageSize = 9,
    int? categoryId,
    String? search,
    double? minPrice,
    double? maxPrice,
    bool onlyInStock = false,
    String? sortBy,
  }) async {
    final Uri uri = Uri.parse('${ApiConfig.baseUrl}/products').replace(
      queryParameters: {
        'page': page.toString(),
        'pageSize': pageSize.toString(),
        if (categoryId != null) 'categoryId': categoryId.toString(),
        if (search != null && search.isNotEmpty) 'search': search,
        if (minPrice != null) 'minPrice': minPrice.toString(),
        if (maxPrice != null) 'maxPrice': maxPrice.toString(),
        if (onlyInStock) 'onlyInStock': 'true',
        if (sortBy != null) 'sortBy': sortBy,
      },
    );

    final res = await http.get(uri, headers: await _headers(needsAuth: false));
    if (res.statusCode == 200) {
      final Map<String, dynamic> data = json.decode(res.body);
      final List<dynamic> items = data['items'] ?? [];
      return items.map((item) => Product.fromJson(item)).toList();
    }
    throw Exception('Ürünler yüklenirken hata oluştu: ${res.statusCode}');
  }

  static Future<Product> getProductById(int id) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/products/$id');
    final res = await http.get(uri, headers: await _headers(needsAuth: false));
    if (res.statusCode == 200) {
      return Product.fromJson(json.decode(res.body));
    }
    throw Exception('Ürün bulunamadı.');
  }

  static Future<List<String>> getTags() async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/products/tags');
    final res = await http.get(uri, headers: await _headers(needsAuth: false));
    if (res.statusCode == 200) {
      final List<dynamic> list = json.decode(res.body);
      return list.map((e) => e.toString()).toList();
    }
    return [];
  }

  static Future<List<Product>> getMyProducts() async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/products/my-products');
    final res = await http.get(uri, headers: await _headers());
    if (res.statusCode == 200) {
      final List<dynamic> list = json.decode(res.body);
      return list.map((e) => Product.fromJson(e)).toList();
    }
    throw Exception('Ürünleriniz getirilemedi.');
  }

  static Future<void> createProduct(String name, String description, double price, int stock, int categoryId, List<String> imageUrls) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/products');
    final res = await http.post(
      uri,
      headers: await _headers(),
      body: json.encode({
        'name': name,
        'description': description,
        'price': price,
        'stock': stock,
        'categoryId': categoryId,
        'imageUrls': imageUrls,
      }),
    );
    if (res.statusCode != 201 && res.statusCode != 200) {
      final data = json.decode(res.body);
      throw Exception(data['message'] ?? 'Ürün ekleme başarısız.');
    }
  }

  static Future<void> updateProduct(int id, String name, String description, double price, int stock, int categoryId, List<String> imageUrls) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/products');
    final res = await http.put(
      uri,
      headers: await _headers(),
      body: json.encode({
        'id': id,
        'name': name,
        'description': description,
        'price': price,
        'stock': stock,
        'categoryId': categoryId,
        'imageUrls': imageUrls,
      }),
    );
    if (res.statusCode != 200) {
      final data = json.decode(res.body);
      throw Exception(data['message'] ?? 'Ürün güncelleme başarısız.');
    }
  }

  static Future<void> deleteProduct(int id) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/products/$id');
    final res = await http.delete(uri, headers: await _headers());
    if (res.statusCode != 200) {
      throw Exception('Ürün silinemedi.');
    }
  }

  // ================= CategoriesController =================
  static Future<List<Category>> getCategories() async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/categories');
    final res = await http.get(uri, headers: await _headers(needsAuth: false));
    if (res.statusCode == 200) {
      final List<dynamic> list = json.decode(res.body);
      return list.map((e) => Category.fromJson(e)).toList();
    }
    return [];
  }

  static Future<void> createCategory(String name) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/categories');
    final res = await http.post(
      uri,
      headers: await _headers(),
      body: json.encode({'name': name}),
    );
    if (res.statusCode != 201 && res.statusCode != 200) {
      throw Exception('Kategori ekleme başarısız.');
    }
  }

  static Future<void> deleteCategory(int id) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/categories/$id');
    final res = await http.delete(uri, headers: await _headers());
    if (res.statusCode != 200) {
      throw Exception('Kategori silinemedi.');
    }
  }

  // ================= BasketsController =================
  static Future<Basket> getBasket() async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/baskets');
    final res = await http.get(uri, headers: await _headers());
    if (res.statusCode == 200) {
      return Basket.fromJson(json.decode(res.body));
    }
    throw Exception('Sepet alınamadı.');
  }

  static Future<void> addToBasket(int productId, int quantity) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/baskets/items');
    final res = await http.post(
      uri,
      headers: await _headers(),
      body: json.encode({'productId': productId, 'quantity': quantity}),
    );
    if (res.statusCode != 200) {
      final data = json.decode(res.body);
      throw Exception(data['message'] ?? 'Sepete ekleme başarısız.');
    }
  }

  static Future<void> updateBasketItem(int productId, int quantity) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/baskets/items');
    final res = await http.put(
      uri,
      headers: await _headers(),
      body: json.encode({'productId': productId, 'quantity': quantity}),
    );
    if (res.statusCode != 200) {
      throw Exception('Sepet adedi güncellenemedi.');
    }
  }

  static Future<void> removeFromBasket(int productId) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/baskets/items/$productId');
    final res = await http.delete(uri, headers: await _headers());
    if (res.statusCode != 200) {
      throw Exception('Ürün sepetten çıkarılamadı.');
    }
  }

  static Future<void> clearBasket() async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/baskets/clear');
    final res = await http.delete(uri, headers: await _headers());
    if (res.statusCode != 200) {
      throw Exception('Sepet temizlenemedi.');
    }
  }

  // ================= OrdersController =================
  static Future<Order> createOrder({
    required String addressTitle,
    required String shippingAddress,
    required String cardNumber,
    required String cardHolderName,
    required String cardExpiry,
    required String cardCvv,
  }) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/orders');
    final res = await http.post(
      uri,
      headers: await _headers(),
      body: json.encode({
        'addressTitle': addressTitle,
        'shippingAddress': shippingAddress,
        'cardNumber': cardNumber,
        'cardHolderName': cardHolderName,
        'cardExpiry': cardExpiry,
        'cardCvv': cardCvv,
      }),
    );
    if (res.statusCode == 200 || res.statusCode == 201) {
      return Order.fromJson(json.decode(res.body));
    }
    final data = json.decode(res.body);
    throw Exception(data['message'] ?? 'Sipariş oluşturma başarısız.');
  }

  static Future<List<Order>> getMyOrders() async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/orders');
    final res = await http.get(uri, headers: await _headers());
    if (res.statusCode == 200) {
      final List<dynamic> list = json.decode(res.body);
      return list.map((e) => Order.fromJson(e)).toList();
    }
    return [];
  }

  static Future<List<Order>> getSellerOrders() async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/orders/seller');
    final res = await http.get(uri, headers: await _headers());
    if (res.statusCode == 200) {
      final List<dynamic> list = json.decode(res.body);
      return list.map((e) => Order.fromJson(e)).toList();
    }
    return [];
  }

  static Future<List<SavedAddress>> getSavedAddresses() async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/orders/saved-addresses');
    final res = await http.get(uri, headers: await _headers());
    if (res.statusCode == 200) {
      final List<dynamic> list = json.decode(res.body);
      return list.map((e) => SavedAddress.fromJson(e)).toList();
    }
    return [];
  }

  // ================= FavoritesController =================
  static Future<List<Product>> getMyFavorites() async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/favorites');
    final res = await http.get(uri, headers: await _headers());
    if (res.statusCode == 200) {
      final List<dynamic> list = json.decode(res.body);
      return list.map((e) => Product.fromJson(e)).toList();
    }
    return [];
  }

  static Future<List<int>> getMyFavoriteIds() async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/favorites/ids');
    final res = await http.get(uri, headers: await _headers());
    if (res.statusCode == 200) {
      final List<dynamic> list = json.decode(res.body);
      return list.map((e) => e as int).toList();
    }
    return [];
  }

  static Future<void> addFavorite(int productId) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/favorites/$productId');
    final res = await http.post(uri, headers: await _headers());
    if (res.statusCode != 200) {
      throw Exception('Favorilere eklenemedi.');
    }
  }

  static Future<void> removeFavorite(int productId) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/favorites/$productId');
    final res = await http.delete(uri, headers: await _headers());
    if (res.statusCode != 200) {
      throw Exception('Favorilerden çıkarılamadı.');
    }
  }

  // ================= CommentsController =================
  static Future<List<Comment>> getCommentsByProductId(int productId) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/comments/product/$productId');
    final res = await http.get(uri, headers: await _headers(needsAuth: false));
    if (res.statusCode == 200) {
      final List<dynamic> list = json.decode(res.body);
      return list.map((e) => Comment.fromJson(e)).toList();
    }
    return [];
  }

  static Future<void> createComment(int productId, String text, int rating) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/comments');
    final res = await http.post(
      uri,
      headers: await _headers(),
      body: json.encode({'productId': productId, 'text': text, 'rating': rating}),
    );
    if (res.statusCode != 200 && res.statusCode != 201) {
      final data = json.decode(res.body);
      throw Exception(data['message'] ?? 'Yorum eklenemedi.');
    }
  }

  // ================= CustomerController =================
  static Future<UserProfile> getProfile() async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/customer/profile');
    final res = await http.get(uri, headers: await _headers());
    if (res.statusCode == 200) {
      return UserProfile.fromJson(json.decode(res.body));
    }
    throw Exception('Profil alınamadı.');
  }

  static Future<void> updateProfile(String firstName, String lastName, String? phoneNumber) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/customer/profile/update');
    final res = await http.post(
      uri,
      headers: await _headers(),
      body: json.encode({'firstName': firstName, 'lastName': lastName, 'phoneNumber': phoneNumber}),
    );
    if (res.statusCode != 200) {
      final data = json.decode(res.body);
      throw Exception(data['message'] ?? 'Profil güncellenemedi.');
    }
  }

  static Future<void> changePassword(String currentPassword, String newPassword, String confirmNewPassword) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/customer/change-password');
    final res = await http.post(
      uri,
      headers: await _headers(),
      body: json.encode({
        'currentPassword': currentPassword,
        'newPassword': newPassword,
        'confirmNewPassword': confirmNewPassword,
      }),
    );
    if (res.statusCode != 200) {
      final data = json.decode(res.body);
      throw Exception(data['message'] ?? 'Şifre değiştirilemedi.');
    }
  }

  // ================= SellersController =================
  static Future<SellerStatusInfo> getMySellerStatus() async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/sellers/my-status');
    final res = await http.get(uri, headers: await _headers());
    if (res.statusCode == 200) {
      return SellerStatusInfo.fromJson(json.decode(res.body));
    }
    return SellerStatusInfo(hasApplied: false, status: '');
  }

  static Future<void> becomeSeller({
    required String storeName,
    required String contactEmail,
    required String contactPhone,
    required String supportLine,
    required String taxNumber,
    required String taxOffice,
  }) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/sellers/apply');
    final res = await http.post(
      uri,
      headers: await _headers(),
      body: json.encode({
        'storeName': storeName,
        'contactEmail': contactEmail,
        'contactPhone': contactPhone,
        'supportLine': supportLine,
        'taxNumber': taxNumber,
        'taxOffice': taxOffice,
      }),
    );
    if (res.statusCode != 200) {
      final data = json.decode(res.body);
      throw Exception(data['message'] ?? 'Satıcı başvurusu başarısız.');
    }
  }

  // ================= AdminController =================
  static Future<List<UserManagement>> getAllUsers() async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/admin/users');
    final res = await http.get(uri, headers: await _headers());
    if (res.statusCode == 200) {
      final List<dynamic> list = json.decode(res.body);
      return list.map((e) => UserManagement.fromJson(e)).toList();
    }
    return [];
  }

  static Future<void> banUser(int id) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/admin/users/$id/ban');
    final res = await http.post(uri, headers: await _headers());
    if (res.statusCode != 200) throw Exception('Kullanıcı banlanamadı.');
  }

  static Future<void> unbanUser(int id) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/admin/users/$id/unban');
    final res = await http.post(uri, headers: await _headers());
    if (res.statusCode != 200) throw Exception('Kullanıcı banı kaldırılamadı.');
  }
}
