class SellerStatusInfo {
  final int? id;
  final bool hasApplied;
  final String status;
  final String? storeName;
  final String? contactEmail;
  final String? contactPhone;
  final String? supportLine;
  final String? taxNumber;
  final String? taxOffice;

  SellerStatusInfo({
    this.id,
    required this.hasApplied,
    required this.status,
    this.storeName,
    this.contactEmail,
    this.contactPhone,
    this.supportLine,
    this.taxNumber,
    this.taxOffice,
  });

  factory SellerStatusInfo.fromJson(Map<String, dynamic> json) {
    return SellerStatusInfo(
      id: json['id'] as int?,
      hasApplied: json['hasApplied'] as bool? ?? false,
      status: json['status'] as String? ?? '',
      storeName: json['storeName'] as String?,
      contactEmail: json['contactEmail'] as String?,
      contactPhone: json['contactPhone'] as String?,
      supportLine: json['supportLine'] as String?,
      taxNumber: json['taxNumber'] as String?,
      taxOffice: json['taxOffice'] as String?,
    );
  }
}
