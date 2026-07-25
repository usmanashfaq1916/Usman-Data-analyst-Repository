import '../../domain/entities/student.dart';

class StudentModel {
  final String id;
  final String userId;
  final String rollNumber;
  final String? cnic;
  final String? dateOfBirth;
  final String? gender;
  final String admissionDate;
  final String? departmentId;
  final String? departmentName;
  final String? programId;
  final String? programName;
  final String? campusId;
  final String? campusName;
  final String status;
  final String? guardianName;
  final String? guardianPhone;
  final String? address;
  final String? photoUrl;
  final String createdAt;

  const StudentModel({
    required this.id,
    required this.userId,
    required this.rollNumber,
    this.cnic,
    this.dateOfBirth,
    this.gender,
    required this.admissionDate,
    this.departmentId,
    this.departmentName,
    this.programId,
    this.programName,
    this.campusId,
    this.campusName,
    this.status = 'ACTIVE',
    this.guardianName,
    this.guardianPhone,
    this.address,
    this.photoUrl,
    required this.createdAt,
  });

  factory StudentModel.fromJson(Map<String, dynamic> json) {
    return StudentModel(
      id: json['id'] as String? ?? '',
      userId: json['userId'] as String? ?? '',
      rollNumber: json['rollNumber'] as String? ?? '',
      cnic: json['cnic'] as String?,
      dateOfBirth: json['dateOfBirth'] as String?,
      gender: json['gender'] as String?,
      admissionDate: json['admissionDate'] as String? ?? DateTime.now().toIso8601String(),
      departmentId: json['departmentId'] as String?,
      departmentName: json['departmentName'] as String?,
      programId: json['programId'] as String?,
      programName: json['programName'] as String?,
      campusId: json['campusId'] as String?,
      campusName: json['campusName'] as String?,
      status: json['status'] as String? ?? 'ACTIVE',
      guardianName: json['guardianName'] as String?,
      guardianPhone: json['guardianPhone'] as String?,
      address: json['address'] as String?,
      photoUrl: json['photoUrl'] as String?,
      createdAt: json['createdAt'] as String? ?? DateTime.now().toIso8601String(),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'userId': userId,
    'rollNumber': rollNumber,
    'cnic': cnic,
    'dateOfBirth': dateOfBirth,
    'gender': gender,
    'admissionDate': admissionDate,
    'departmentId': departmentId,
    'departmentName': departmentName,
    'programId': programId,
    'programName': programName,
    'campusId': campusId,
    'campusName': campusName,
    'status': status,
    'guardianName': guardianName,
    'guardianPhone': guardianPhone,
    'address': address,
    'photoUrl': photoUrl,
    'createdAt': createdAt,
  };

  Student toEntity() {
    return Student(
      id: id,
      userId: userId,
      rollNumber: rollNumber,
      cnic: cnic,
      dateOfBirth: dateOfBirth != null ? DateTime.parse(dateOfBirth!) : null,
      gender: gender,
      admissionDate: DateTime.parse(admissionDate),
      departmentId: departmentId,
      departmentName: departmentName,
      programId: programId,
      programName: programName,
      campusId: campusId,
      campusName: campusName,
      status: status,
      guardianName: guardianName,
      guardianPhone: guardianPhone,
      address: address,
      photoUrl: photoUrl,
      createdAt: DateTime.parse(createdAt),
    );
  }

  factory StudentModel.fromEntity(Student student) {
    return StudentModel(
      id: student.id,
      userId: student.userId,
      rollNumber: student.rollNumber,
      cnic: student.cnic,
      dateOfBirth: student.dateOfBirth?.toIso8601String(),
      gender: student.gender,
      admissionDate: student.admissionDate.toIso8601String(),
      departmentId: student.departmentId,
      departmentName: student.departmentName,
      programId: student.programId,
      programName: student.programName,
      campusId: student.campusId,
      campusName: student.campusName,
      status: student.status,
      guardianName: student.guardianName,
      guardianPhone: student.guardianPhone,
      address: student.address,
      photoUrl: student.photoUrl,
      createdAt: student.createdAt.toIso8601String(),
    );
  }
}
