class Product {
  final int id;
  final String name;
  final String description;
  final double price;
  final int stock;
  final int categoryId;
  final String categoryName;
  final String storeName;
  final String? mainImageUrl;

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.stock,
    required this.categoryId,
    required this.categoryName,
    required this.storeName,
    this.mainImageUrl,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] as int,
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      stock: json['stock'] as int? ?? 0,
      categoryId: json['categoryId'] as int? ?? 0,
      categoryName: json['categoryName'] ?? '',
      storeName: json['storeName'] ?? '',
      mainImageUrl: json['mainImageUrl'] as String?,
    );
  }
}
