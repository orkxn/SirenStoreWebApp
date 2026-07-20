import 'package:flutter/material.dart';
import 'package:siren_store_mobile/models/product.dart';
import 'package:siren_store_mobile/services/api_service.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key});

  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  List<Product> _favorites = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadFavorites();
  }

  Future<void> _loadFavorites() async {
    setState(() => _isLoading = true);
    try {
      final favs = await ApiService.getMyFavorites();
      setState(() {
        _favorites = favs;
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _remove(int productId) async {
    await ApiService.removeFavorite(productId);
    _loadFavorites();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Favorilerim')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _favorites.isEmpty
              ? const Center(child: Text('Henüz favoriniz yok.'))
              : ListView.builder(
                  itemCount: _favorites.length,
                  itemBuilder: (ctx, i) {
                    final p = _favorites[i];
                    return ListTile(
                      title: Text(p.name),
                      subtitle: Text('${p.price.toStringAsFixed(2)} TL - ${p.storeName}'),
                      trailing: IconButton(
                        icon: const Icon(Icons.favorite, color: Colors.red),
                        onPressed: () => _remove(p.id),
                      ),
                    );
                  },
                ),
    );
  }
}
