import 'package:equatable/equatable.dart';

enum UserRole {
  SUPER_ADMIN,
  CHAIRMAN,
  DIRECTOR,
  PRINCIPAL,
  HOD,
  TEACHER,
  HR,
  STUDENT,
  PARENT,
}

class User extends Equatable {
  final String id;
  final String email;
  final String firstName;
  final String lastName;
  final String? phone;
  final String? avatar;
  final UserRole role;
  final bool isActive;
  final DateTime? lastLoginAt;
  final DateTime createdAt;

  const User({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    this.phone,
    this.avatar,
    required this.role,
    this.isActive = true,
    this.lastLoginAt,
    required this.createdAt,
  });

  String get fullName => '$firstName $lastName';
  String get initials => '${firstName[0]}${lastName[0]}'.toUpperCase();

  User copyWith({
    String? id,
    String? email,
    String? firstName,
    String? lastName,
    String? phone,
    String? avatar,
    UserRole? role,
    bool? isActive,
    DateTime? lastLoginAt,
    DateTime? createdAt,
  }) {
    return User(
      id: id ?? this.id,
      email: email ?? this.email,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      phone: phone ?? this.phone,
      avatar: avatar ?? this.avatar,
      role: role ?? this.role,
      isActive: isActive ?? this.isActive,
      lastLoginAt: lastLoginAt ?? this.lastLoginAt,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  @override
  List<Object?> get props => [id, email, firstName, lastName, role];
}
