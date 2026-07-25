import '../../domain/entities/teacher.dart';

class TeacherModel {
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

  const TeacherModel({
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

  factory TeacherModel.fromJson(Map<String, dynamic> json) {
    return TeacherModel(
      id: json['id'] as String? ?? '',
      userId: json['userId'] as String? ?? '',
      name: json['name'] as String? ?? '',
      departmentId: json['departmentId'] as String?,
      departmentName: json['departmentName'] as String?,
      qualification: json['qualification'] as String?,
      experience: json['experience'] as int?,
      phone: json['phone'] as String?,
      email: json['email'] as String?,
      campusId: json['campusId'] as String?,
      campusName: json['campusName'] as String?,
      photoUrl: json['photoUrl'] as String?,
      status: json['status'] as String? ?? 'ACTIVE',
      joinedAt: json['joinedAt'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'userId': userId,
    'name': name,
    'departmentId': departmentId,
    'departmentName': departmentName,
    'qualification': qualification,
    'experience': experience,
    'phone': phone,
    'email': email,
    'campusId': campusId,
    'campusName': campusName,
    'photoUrl': photoUrl,
    'status': status,
    'joinedAt': joinedAt,
  };

  Teacher toEntity() {
    return Teacher(
      id: id,
      userId: userId,
      name: name,
      departmentId: departmentId,
      departmentName: departmentName,
      qualification: qualification,
      experience: experience,
      phone: phone,
      email: email,
      campusId: campusId,
      campusName: campusName,
      photoUrl: photoUrl,
      status: status,
      joinedAt: joinedAt,
    );
  }

  factory TeacherModel.fromEntity(Teacher teacher) {
    return TeacherModel(
      id: teacher.id,
      userId: teacher.userId,
      name: teacher.name,
      departmentId: teacher.departmentId,
      departmentName: teacher.departmentName,
      qualification: teacher.qualification,
      experience: teacher.experience,
      phone: teacher.phone,
      email: teacher.email,
      campusId: teacher.campusId,
      campusName: teacher.campusName,
      photoUrl: teacher.photoUrl,
      status: teacher.status,
      joinedAt: teacher.joinedAt,
    );
  }
}
