class UserProfile {
  final int id;
  final String email;
  final String firstName;
  final String lastName;
  final String? phoneNumber;
  final String role;
  final bool emailConfirmed;

  UserProfile({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    this.phoneNumber,
    required this.role,
    required this.emailConfirmed,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      id: json['id'] as int? ?? 0,
      email: json['email'] as String? ?? '',
      firstName: json['firstName'] as String? ?? '',
      lastName: json['lastName'] as String? ?? '',
      phoneNumber: json['phoneNumber'] as String?,
      role: json['role'] as String? ?? 'Customer',
      emailConfirmed: json['emailConfirmed'] as bool? ?? false,
    );
  }
}
