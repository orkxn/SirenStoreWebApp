class BasketItem {
  final int productId;
  final String productName;
  final double price;
  final int quantity;
  final String? mainImageUrl;
  final String storeName;

  BasketItem({
    required this.productId,
    required this.productName,
    required this.price,
    required this.quantity,
    this.mainImageUrl,
    required this.storeName,
  });

  factory BasketItem.fromJson(Map<String, dynamic> json) {
    return BasketItem(
      productId: json['productId'] as int? ?? 0,
      productName: json['productName'] as String? ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      quantity: json['quantity'] as int? ?? 0,
      mainImageUrl: json['mainImageUrl'] as String?,
      storeName: json['storeName'] as String? ?? '',
    );
  }
}

class Basket {
  final List<BasketItem> items;
  final double totalPrice;

  Basket({
    required this.items,
    required this.totalPrice,
  });

  factory Basket.fromJson(Map<String, dynamic> json) {
    final rawItems = json['items'] as List<dynamic>? ?? [];
    return Basket(
      items: rawItems.map((e) => BasketItem.fromJson(e)).toList(),
      totalPrice: (json['totalPrice'] as num?)?.toDouble() ?? 0.0,
    );
  }
}
