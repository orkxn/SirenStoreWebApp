import 'package:flutter/material.dart';
import 'package:siren_store_mobile/models/order.dart';
import 'package:siren_store_mobile/services/api_service.dart';

class OrdersScreen extends StatefulWidget {
  const OrdersScreen({super.key});

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  List<Order> _orders = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadOrders();
  }

  Future<void> _loadOrders() async {
    setState(() => _isLoading = true);
    try {
      final orders = await ApiService.getMyOrders();
      setState(() {
        _orders = orders;
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Siparişlerim')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _orders.isEmpty
              ? const Center(child: Text('Henüz siparişiniz yok.'))
              : ListView.builder(
                  itemCount: _orders.length,
                  itemBuilder: (ctx, i) {
                    final o = _orders[i];
                    return ExpansionTile(
                      title: Text('Sipariş #${o.id} - ${o.totalAmount.toStringAsFixed(2)} TL'),
                      subtitle: Text('Tarih: ${o.orderDate} | Durum: ${o.status}'),
                      children: o.items.map((item) {
                        return ListTile(
                          title: Text(item.productName),
                          subtitle: Text('${item.quantity} adet x ${item.unitPrice.toStringAsFixed(2)} TL'),
                          trailing: Chip(label: Text(item.status)),
                        );
                      }).toList(),
                    );
                  },
                ),
    );
  }
}
