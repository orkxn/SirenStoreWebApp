class UserManagement {
  final int id;
  final String email;
  final String fullName;
  final String role;
  final bool isBanned;

  UserManagement({
    required this.id,
    required this.email,
    required this.fullName,
    required this.role,
    required this.isBanned,
  });

  factory UserManagement.fromJson(Map<String, dynamic> json) {
    return UserManagement(
      id: json['id'] as int? ?? 0,
      email: json['email'] as String? ?? '',
      fullName: json['fullName'] as String? ?? '',
      role: json['role'] as String? ?? '',
      isBanned: json['isBanned'] as bool? ?? false,
    );
  }
}

class AuditLog {
  final int id;
  final String action;
  final String details;
  final String timestamp;

  AuditLog({
    required this.id,
    required this.action,
    required this.details,
    required this.timestamp,
  });

  factory AuditLog.fromJson(Map<String, dynamic> json) {
    return AuditLog(
      id: json['id'] as int? ?? 0,
      action: json['action'] as String? ?? '',
      details: json['details'] as String? ?? '',
      timestamp: json['timestamp'] as String? ?? '',
    );
  }
}
