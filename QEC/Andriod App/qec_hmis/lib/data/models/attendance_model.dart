import '../../domain/entities/attendance.dart';

class AttendanceModel {
  final String id;
  final String studentId;
  final String? studentName;
  final String? rollNumber;
  final String date;
  final String status;
  final String? remarks;
  final String createdAt;

  const AttendanceModel({
    required this.id,
    required this.studentId,
    this.studentName,
    this.rollNumber,
    required this.date,
    required this.status,
    this.remarks,
    required this.createdAt,
  });

  factory AttendanceModel.fromJson(Map<String, dynamic> json) {
    return AttendanceModel(
      id: json['id'] as String? ?? '',
      studentId: json['studentId'] as String? ?? '',
      studentName: json['studentName'] as String?,
      rollNumber: json['rollNumber'] as String?,
      date: json['date'] as String? ?? DateTime.now().toIso8601String(),
      status: json['status'] as String? ?? 'PRESENT',
      remarks: json['remarks'] as String?,
      createdAt: json['createdAt'] as String? ?? DateTime.now().toIso8601String(),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'studentId': studentId,
    'studentName': studentName,
    'rollNumber': rollNumber,
    'date': date,
    'status': status,
    'remarks': remarks,
    'createdAt': createdAt,
  };

  Attendance toEntity() {
    return Attendance(
      id: id,
      studentId: studentId,
      studentName: studentName,
      rollNumber: rollNumber,
      date: DateTime.parse(date),
      status: AttendanceStatus.values.firstWhere(
        (s) => s.name == status,
        orElse: () => AttendanceStatus.PRESENT,
      ),
      remarks: remarks,
      createdAt: DateTime.parse(createdAt),
    );
  }

  factory AttendanceModel.fromEntity(Attendance attendance) {
    return AttendanceModel(
      id: attendance.id,
      studentId: attendance.studentId,
      studentName: attendance.studentName,
      rollNumber: attendance.rollNumber,
      date: attendance.date.toIso8601String(),
      status: attendance.status.name,
      remarks: attendance.remarks,
      createdAt: attendance.createdAt.toIso8601String(),
    );
  }
}

class AttendanceStatsModel {
  final int present;
  final int absent;
  final int late;
  final int excused;
  final int total;

  const AttendanceStatsModel({
    required this.present,
    required this.absent,
    required this.late,
    required this.excused,
    required this.total,
  });

  factory AttendanceStatsModel.fromJson(Map<String, dynamic> json) {
    return AttendanceStatsModel(
      present: json['present'] as int? ?? 0,
      absent: json['absent'] as int? ?? 0,
      late: json['late'] as int? ?? 0,
      excused: json['excused'] as int? ?? 0,
      total: json['total'] as int? ?? 0,
    );
  }

  AttendanceStats toEntity() {
    return AttendanceStats(
      present: present,
      absent: absent,
      late: late,
      excused: excused,
      total: total,
    );
  }
}
