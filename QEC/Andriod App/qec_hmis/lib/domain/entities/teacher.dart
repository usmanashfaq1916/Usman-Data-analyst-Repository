import 'package:equatable/equatable.dart';

class Teacher extends Equatable {
  final String id;
  final String userId;
  final String name;
  final String? departmentId;
  final String? departmentName;
  final String? qualification;
  final int? experience;
  final String? phone;
  final String? email;
  final String? campusId;
  final String? campusName;
  final String? photoUrl;
  final String status;
  final String? joinedAt;

  const Teacher({
    required this.id,
    required this.userId,
    required this.name,
    this.departmentId,
    this.departmentName,
    this.qualification,
    this.experience,
    this.phone,
    this.email,
    this.campusId,
    this.campusName,
    this.photoUrl,
    this.status = 'ACTIVE',
    this.joinedAt,
  });

  @override
  List<Object?> get props => [id, userId, name, status];
}
