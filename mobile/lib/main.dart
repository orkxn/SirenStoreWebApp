import 'package:flutter/material.dart';
import 'package:siren_store_mobile/screens/home_screen.dart';
import 'package:siren_store_mobile/screens/basket_screen.dart';
import 'package:siren_store_mobile/screens/favorites_screen.dart';
import 'package:siren_store_mobile/screens/orders_screen.dart';
import 'package:siren_store_mobile/screens/profile_screen.dart';
import 'package:siren_store_mobile/screens/seller_panel_screen.dart';
import 'package:siren_store_mobile/screens/admin_panel_screen.dart';
import 'package:siren_store_mobile/screens/login_screen.dart';
import 'package:siren_store_mobile/services/api_service.dart';

void main() {
  runApp(const SirenStoreApp());
}

class SirenStoreApp extends StatelessWidget {
  const SirenStoreApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Siren Store',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF6366F1),
        ),
      ),
      home: const MainNavigationScreen(),
    );
  }
}

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;
  bool _isLoggedIn = false;

  @override
  void initState() {
    super.initState();
    _checkLoginStatus();
  }

  Future<void> _checkLoginStatus() async {
    final token = await ApiService.getToken();
    setState(() {
      _isLoggedIn = token != null && token.isNotEmpty;
    });
  }

  Widget _buildBody() {
    if (_currentIndex == 0) return const HomeScreen();
    if (!_isLoggedIn) return LoginScreen(onLoginSuccess: _checkLoginStatus);

    switch (_currentIndex) {
      case 1:
        return const FavoritesScreen();
      case 2:
        return const BasketScreen();
      case 3:
        return const OrdersScreen();
      case 4:
        return ProfileScreen(
          onLogout: () async {
            await ApiService.logout();
            _checkLoginStatus();
          },
          onOpenSellerPanel: () {
            Navigator.push(context, MaterialPageRoute(builder: (ctx) => const SellerPanelScreen()));
          },
          onOpenAdminPanel: () {
            Navigator.push(context, MaterialPageRoute(builder: (ctx) => const AdminPanelScreen()));
          },
        );
      default:
        return const HomeScreen();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _buildBody(),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Ana Sayfa'),
          BottomNavigationBarItem(icon: Icon(Icons.favorite), label: 'Favoriler'),
          BottomNavigationBarItem(icon: Icon(Icons.shopping_cart), label: 'Sepetim'),
          BottomNavigationBarItem(icon: Icon(Icons.receipt_long), label: 'Siparişler'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profil'),
        ],
      ),
    );
  }
}
