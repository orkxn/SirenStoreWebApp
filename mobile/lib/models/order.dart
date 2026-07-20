class OrderItem {
  final int id;
  final int productId;
  final String productName;
  final double unitPrice;
  final int quantity;
  final String status;

  OrderItem({
    required this.id,
    required this.productId,
    required this.productName,
    required this.unitPrice,
    required this.quantity,
    required this.status,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) {
    return OrderItem(
      id: json['id'] as int? ?? 0,
      productId: json['productId'] as int? ?? 0,
      productName: json['productName'] as String? ?? '',
      unitPrice: (json['unitPrice'] as num?)?.toDouble() ?? 0.0,
      quantity: json['quantity'] as int? ?? 0,
      status: json['status'] as String? ?? '',
    );
  }
}

class Order {
  final int id;
  final String orderDate;
  final String addressTitle;
  final String shippingAddress;
  final double totalAmount;
  final String status;
  final List<OrderItem> items;

  Order({
    required this.id,
    required this.orderDate,
    required this.addressTitle,
    required this.shippingAddress,
    required this.totalAmount,
    required this.status,
    required this.items,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    final rawItems = json['items'] as List<dynamic>? ?? [];
    return Order(
      id: json['id'] as int? ?? 0,
      orderDate: json['orderDate'] as String? ?? '',
      addressTitle: json['addressTitle'] as String? ?? '',
      shippingAddress: json['shippingAddress'] as String? ?? '',
      totalAmount: (json['totalAmount'] as num?)?.toDouble() ?? 0.0,
      status: json['status'] as String? ?? '',
      items: rawItems.map((e) => OrderItem.fromJson(e)).toList(),
    );
  }
}

class SavedAddress {
  final String addressTitle;
  final String shippingAddress;

  SavedAddress({required this.addressTitle, required this.shippingAddress});

  factory SavedAddress.fromJson(Map<String, dynamic> json) {
    return SavedAddress(
      addressTitle: json['addressTitle'] as String? ?? '',
      shippingAddress: json['shippingAddress'] as String? ?? '',
    );
  }
}
