import 'package:flutter/material.dart';
import 'package:siren_store_mobile/models/product.dart';
import 'package:siren_store_mobile/models/order.dart';
import 'package:siren_store_mobile/models/category.dart';
import 'package:siren_store_mobile/services/api_service.dart';

class SellerPanelScreen extends StatefulWidget {
  const SellerPanelScreen({super.key});

  @override
  State<SellerPanelScreen> createState() => _SellerPanelScreenState();
}

class _SellerPanelScreenState extends State<SellerPanelScreen> {
  List<Product> _products = [];
  List<Order> _sellerOrders = [];
  List<Category> _categories = [];
  bool _isLoading = true;

  final _nameCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  final _priceCtrl = TextEditingController();
  final _stockCtrl = TextEditingController();
  int? _selectedCatId;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    try {
      final prods = await ApiService.getMyProducts();
      final orders = await ApiService.getSellerOrders();
      final cats = await ApiService.getCategories();
      setState(() {
        _products = prods;
        _sellerOrders = orders;
        _categories = cats;
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _addProduct() async {
    if (_nameCtrl.text.isEmpty || _priceCtrl.text.isEmpty || _selectedCatId == null) return;
    try {
      await ApiService.createProduct(
        _nameCtrl.text.trim(),
        _descCtrl.text.trim(),
        double.parse(_priceCtrl.text),
        int.parse(_stockCtrl.text.isEmpty ? '10' : _stockCtrl.text),
        _selectedCatId!,
        [],
      );
      _nameCtrl.clear();
      _descCtrl.clear();
      _priceCtrl.clear();
      _loadData();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Hata: $e')));
      }
    }
  }

  void _showAddProductDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Yeni Ürün Ekle'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(controller: _nameCtrl, decoration: const InputDecoration(labelText: 'Ürün Adı')),
              TextField(controller: _descCtrl, decoration: const InputDecoration(labelText: 'Açıklama')),
              TextField(controller: _priceCtrl, decoration: const InputDecoration(labelText: 'Fiyat (TL)'), keyboardType: TextInputType.number),
              TextField(controller: _stockCtrl, decoration: const InputDecoration(labelText: 'Stok'), keyboardType: TextInputType.number),
              DropdownButtonFormField<int>(
                value: _selectedCatId,
                items: _categories.map((c) => DropdownMenuItem(value: c.id, child: Text(c.name))).toList(),
                onChanged: (val) => setState(() => _selectedCatId = val),
                decoration: const InputDecoration(labelText: 'Kategori'),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('İptal')),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              _addProduct();
            },
            child: const Text('Kaydet'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Satıcı Paneli'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'Ürünlerim'),
              Tab(text: 'Gelen Siparişler'),
            ],
          ),
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: _showAddProductDialog,
          child: const Icon(Icons.add),
        ),
        body: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : TabBarView(
                children: [
                  ListView.builder(
                    itemCount: _products.length,
                    itemBuilder: (ctx, i) {
                      final p = _products[i];
                      return ListTile(
                        title: Text(p.name),
                        subtitle: Text('${p.price} TL | Stok: ${p.stock}'),
                        trailing: IconButton(
                          icon: const Icon(Icons.delete, color: Colors.red),
                          onPressed: () async {
                            await ApiService.deleteProduct(p.id);
                            _loadData();
                          },
                        ),
                      );
                    },
                  ),
                  ListView.builder(
                    itemCount: _sellerOrders.length,
                    itemBuilder: (ctx, i) {
                      final o = _sellerOrders[i];
                      return ExpansionTile(
                        title: Text('Sipariş #${o.id} - ${o.totalAmount} TL'),
                        children: o.items.map((item) => ListTile(title: Text(item.productName), trailing: Text(item.status))).toList(),
                      );
                    },
                  ),
                ],
              ),
      ),
    );
  }
}
