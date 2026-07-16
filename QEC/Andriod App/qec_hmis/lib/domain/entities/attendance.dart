import 'package:equatable/equatable.dart';

enum AttendanceStatus { PRESENT, ABSENT, LATE, EXCUSED }

class Attendance extends Equatable {
  final String id;
  final String studentId;
  final String? studentName;
  final String? rollNumber;
  final DateTime date;
  final AttendanceStatus status;
  final String? remarks;
  final DateTime createdAt;

  const Attendance({
    required this.id,
    required this.studentId,
    this.studentName,
    this.rollNumber,
    required this.date,
    required this.status,
    this.remarks,
    required this.createdAt,
  });

  Attendance copyWith({AttendanceStatus? status, String? remarks}) {
    return Attendance(
      id: id,
      studentId: studentId,
      studentName: studentName,
      rollNumber: rollNumber,
      date: date,
      status: status ?? this.status,
      remarks: remarks ?? this.remarks,
      createdAt: createdAt,
    );
  }

  @override
  List<Object?> get props => [id, studentId, date, status];
}

class AttendanceStats extends Equatable {
  final int present;
  final int absent;
  final int late;
  final int excused;
  final int total;

  const AttendanceStats({
    required this.present,
    required this.absent,
    required this.late,
    required this.excused,
    required this.total,
  });

  double get percentage => total > 0 ? (present / total) * 100 : 0;

  @override
  List<Object?> get props => [present, absent, late, excused, total];
}
