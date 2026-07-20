import 'package:flutter/material.dart';
import 'package:siren_store_mobile/models/product.dart';
import 'package:siren_store_mobile/models/category.dart';
import 'package:siren_store_mobile/services/api_service.dart';
import 'package:siren_store_mobile/screens/product_detail_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<Product> _products = [];
  List<Category> _categories = [];
  bool _isLoading = true;
  String _searchQuery = '';
  int? _selectedCatId;

  @override
  void initState() {
    super.initState();
    _loadInitialData();
  }

  Future<void> _loadInitialData() async {
    setState(() => _isLoading = true);
    
    try {
      final cats = await ApiService.getCategories();
      if (mounted) setState(() => _categories = cats);
    } catch (e) {
      debugPrint('Kategori yükleme hatası: $e');
    }

    try {
      final products = await ApiService.getProducts(search: _searchQuery, categoryId: _selectedCatId);
      if (mounted) {
        setState(() {
          _products = products;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Veri yüklenemedi: $e')),
        );
      }
    }
  }

  Future<void> _loadProducts() async {
    try {
      final products = await ApiService.getProducts(search: _searchQuery, categoryId: _selectedCatId);
      setState(() {
        _products = products;
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Ürünler yüklenemedi: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Siren Store'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadInitialData,
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Ürün ara...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onSubmitted: (val) {
                _searchQuery = val;
                _loadProducts();
              },
            ),
          ),
          if (_categories.isNotEmpty)
            SizedBox(
              height: 40,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 12),
                itemCount: _categories.length + 1,
                itemBuilder: (ctx, i) {
                  if (i == 0) {
                    final isSel = _selectedCatId == null;
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: FilterChip(
                        label: const Text('Tümü'),
                        selected: isSel,
                        onSelected: (_) {
                          setState(() => _selectedCatId = null);
                          _loadProducts();
                        },
                      ),
                    );
                  }
                  final cat = _categories[i - 1];
                  final isSel = _selectedCatId == cat.id;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: FilterChip(
                      label: Text(cat.name),
                      selected: isSel,
                      onSelected: (_) {
                        setState(() => _selectedCatId = cat.id);
                        _loadProducts();
                      },
                    ),
                  );
                },
              ),
            ),
          const SizedBox(height: 8),
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _products.isEmpty
                    ? const Center(child: Text('Ürün bulunamadı.'))
                    : RefreshIndicator(
                        onRefresh: _loadProducts,
                        child: GridView.builder(
                          padding: const EdgeInsets.all(12),
                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            childAspectRatio: 0.75,
                            crossAxisSpacing: 12,
                            mainAxisSpacing: 12,
                          ),
                          itemCount: _products.length,
                          itemBuilder: (context, index) {
                            final product = _products[index];
                            return GestureDetector(
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (ctx) => ProductDetailScreen(product: product),
                                  ),
                                );
                              },
                              child: Card(
                                elevation: 2,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Expanded(
                                      child: Container(
                                        decoration: BoxDecoration(
                                          color: Colors.grey[200],
                                          borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                                        ),
                                        width: double.infinity,
                                        child: product.mainImageUrl != null && product.mainImageUrl!.isNotEmpty
                                            ? Image.network(
                                                product.mainImageUrl!,
                                                fit: BoxFit.cover,
                                                errorBuilder: (ctx, err, stack) => const Icon(Icons.shopping_bag, size: 48, color: Colors.grey),
                                              )
                                            : const Icon(Icons.shopping_bag, size: 48, color: Colors.grey),
                                      ),
                                    ),
                                    Padding(
                                      padding: const EdgeInsets.all(8.0),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            product.name,
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                            style: const TextStyle(fontWeight: FontWeight.bold),
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            '${product.price.toStringAsFixed(2)} TL',
                                            style: TextStyle(
                                              color: Theme.of(context).primaryColor,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                          Text(
                                            product.storeName,
                                            style: const TextStyle(fontSize: 12, color: Colors.grey),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
                      ),
          ),
        ],
      ),
    );
  }
}
