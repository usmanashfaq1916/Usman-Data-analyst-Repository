import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/user.dart';

part 'user_model.g.dart';

@JsonSerializable()
class UserModel {
  final String id;
  final String email;
  final String firstName;
  final String lastName;
  final String? phone;
  final String? avatar;
  final String role;
  final bool isActive;
  final String? lastLoginAt;
  final String createdAt;

  const UserModel({
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

  factory UserModel.fromJson(Map<String, dynamic> json) => _$UserModelFromJson(json);
  Map<String, dynamic> toJson() => _$UserModelToJson(this);

  User toEntity() {
    return User(
      id: id,
      email: email,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      avatar: avatar,
      role: UserRole.values.firstWhere(
        (r) => r.name == role,
        orElse: () => UserRole.STUDENT,
      ),
      isActive: isActive,
      lastLoginAt: lastLoginAt != null ? DateTime.parse(lastLoginAt!) : null,
      createdAt: DateTime.parse(createdAt),
    );
  }

  factory UserModel.fromEntity(User user) {
    return UserModel(
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role.name,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt?.toIso8601String(),
      createdAt: user.createdAt.toIso8601String(),
    );
  }
}
