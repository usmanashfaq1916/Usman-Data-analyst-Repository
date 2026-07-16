import 'package:equatable/equatable.dart';

class Student extends Equatable {
  final String id;
  final String userId;
  final String rollNumber;
  final String? cnic;
  final DateTime? dateOfBirth;
  final String? gender;
  final DateTime admissionDate;
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
  final DateTime createdAt;

  const Student({
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

  Student copyWith({
    String? id,
    String? userId,
    String? rollNumber,
    String? cnic,
    DateTime? dateOfBirth,
    String? gender,
    DateTime? admissionDate,
    String? departmentId,
    String? departmentName,
    String? programId,
    String? programName,
    String? campusId,
    String? campusName,
    String? status,
    String? guardianName,
    String? guardianPhone,
    String? address,
    String? photoUrl,
    DateTime? createdAt,
  }) {
    return Student(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      rollNumber: rollNumber ?? this.rollNumber,
      cnic: cnic ?? this.cnic,
      dateOfBirth: dateOfBirth ?? this.dateOfBirth,
      gender: gender ?? this.gender,
      admissionDate: admissionDate ?? this.admissionDate,
      departmentId: departmentId ?? this.departmentId,
      departmentName: departmentName ?? this.departmentName,
      programId: programId ?? this.programId,
      programName: programName ?? this.programName,
      campusId: campusId ?? this.campusId,
      campusName: campusName ?? this.campusName,
      status: status ?? this.status,
      guardianName: guardianName ?? this.guardianName,
      guardianPhone: guardianPhone ?? this.guardianPhone,
      address: address ?? this.address,
      photoUrl: photoUrl ?? this.photoUrl,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  @override
  List<Object?> get props => [id, rollNumber, status];
}
