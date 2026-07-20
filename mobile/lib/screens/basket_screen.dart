import 'package:flutter/material.dart';
import 'package:siren_store_mobile/models/basket.dart';
import 'package:siren_store_mobile/services/api_service.dart';

class BasketScreen extends StatefulWidget {
  const BasketScreen({super.key});

  @override
  State<BasketScreen> createState() => _BasketScreenState();
}

class _BasketScreenState extends State<BasketScreen> {
  Basket? _basket;
  bool _isLoading = true;

  final _titleCtrl = TextEditingController(text: 'Ev');
  final _addressCtrl = TextEditingController(text: 'Atatürk Cad. No:1 İstanbul');
  final _cardHolderCtrl = TextEditingController(text: 'Ahmet Yılmaz');
  final _cardNumberCtrl = TextEditingController(text: '5520123456789012');
  final _expiryCtrl = TextEditingController(text: '12/28');
  final _cvvCtrl = TextEditingController(text: '123');

  @override
  void initState() {
    super.initState();
    _loadBasket();
  }

  Future<void> _loadBasket() async {
    setState(() => _isLoading = true);
    try {
      final b = await ApiService.getBasket();
      setState(() {
        _basket = b;
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _removeItem(int productId) async {
    await ApiService.removeFromBasket(productId);
    _loadBasket();
  }

  Future<void> _checkout() async {
    if (_basket == null || _basket!.items.isEmpty) return;
    try {
      await ApiService.createOrder(
        addressTitle: _titleCtrl.text.trim(),
        shippingAddress: _addressCtrl.text.trim(),
        cardNumber: _cardNumberCtrl.text.trim(),
        cardHolderName: _cardHolderCtrl.text.trim(),
        cardExpiry: _expiryCtrl.text.trim(),
        cardCvv: _cvvCtrl.text.trim(),
      );
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Sipariş başarıyla tamamlandı!')),
        );
        _loadBasket();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Hata: $e')));
      }
    }
  }

  void _showCheckoutDialog() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(bottom: MediaQuery.of(ctx).viewInsets.bottom, left: 16, right: 16, top: 16),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('Ödeme ve Teslimat Bilgileri', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              TextField(controller: _titleCtrl, decoration: const InputDecoration(labelText: 'Adres Başlığı')),
              TextField(controller: _addressCtrl, decoration: const InputDecoration(labelText: 'Teslimat Adresi')),
              TextField(controller: _cardHolderCtrl, decoration: const InputDecoration(labelText: 'Kart Üzerindeki İsim')),
              TextField(controller: _cardNumberCtrl, decoration: const InputDecoration(labelText: 'Kart Numarası (16 Hane)')),
              Row(
                children: [
                  Expanded(child: TextField(controller: _expiryCtrl, decoration: const InputDecoration(labelText: 'S.K.T (MM/YY)'))),
                  const SizedBox(width: 12),
                  Expanded(child: TextField(controller: _cvvCtrl, decoration: const InputDecoration(labelText: 'CVV (3 Hane)'))),
                ],
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  Navigator.pop(ctx);
                  _checkout();
                },
                style: ElevatedButton.styleFrom(minimumSize: const Size.fromHeight(48)),
                child: Text('Siparişi Tamamla (${_basket?.totalPrice.toStringAsFixed(2)} TL)'),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Sepetim')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _basket == null || _basket!.items.isEmpty
              ? const Center(child: Text('Sepetiniz boş.'))
              : Column(
                  children: [
                    Expanded(
                      child: ListView.builder(
                        itemCount: _basket!.items.length,
                        itemBuilder: (ctx, i) {
                          final item = _basket!.items[i];
                          return ListTile(
                            title: Text(item.productName),
                            subtitle: Text('${item.quantity} adet x ${item.price.toStringAsFixed(2)} TL'),
                            trailing: IconButton(
                              icon: const Icon(Icons.delete, color: Colors.red),
                              onPressed: () => _removeItem(item.productId),
                            ),
                          );
                        },
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(color: Theme.of(context).cardColor, boxShadow: const [BoxShadow(blurRadius: 4, color: Colors.black12)]),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Toplam: ${_basket!.totalPrice.toStringAsFixed(2)} TL', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                          ElevatedButton(
                            onPressed: _showCheckoutDialog,
                            child: const Text('Satın Al'),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
    );
  }
}
