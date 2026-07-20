class Comment {
  final int id;
  final String text;
  final int rating;
  final String creationDate;
  final int userId;
  final String userFullName;
  final int productId;
  final String? productName;
  final String? productImageUrl;

  Comment({
    required this.id,
    required this.text,
    required this.rating,
    required this.creationDate,
    required this.userId,
    required this.userFullName,
    required this.productId,
    this.productName,
    this.productImageUrl,
  });

  factory Comment.fromJson(Map<String, dynamic> json) {
    return Comment(
      id: json['id'] as int? ?? 0,
      text: json['text'] as String? ?? '',
      rating: json['rating'] as int? ?? 5,
      creationDate: json['creationDate'] as String? ?? '',
      userId: json['userId'] as int? ?? 0,
      userFullName: json['userFullName'] as String? ?? '',
      productId: json['productId'] as int? ?? 0,
      productName: json['productName'] as String?,
      productImageUrl: json['productImageUrl'] as String?,
    );
  }
}
