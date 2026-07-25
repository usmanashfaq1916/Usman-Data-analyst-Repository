import '../../domain/entities/dashboard_stats.dart';

class DashboardStatsModel {
  final int totalStudents;
  final int totalTeachers;
  final int totalStaff;
  final int totalParents;
  final double todayAttendance;
  final double totalFeeCollected;
  final double totalFeePending;
  final int upcomingExams;
  final int recentAdmissions;
  final int newNotifications;
  final int birthdays;

  const DashboardStatsModel({
    this.totalStudents = 0,
    this.totalTeachers = 0,
    this.totalStaff = 0,
    this.totalParents = 0,
    this.todayAttendance = 0,
    this.totalFeeCollected = 0,
    this.totalFeePending = 0,
    this.upcomingExams = 0,
    this.recentAdmissions = 0,
    this.newNotifications = 0,
    this.birthdays = 0,
  });

  factory DashboardStatsModel.fromJson(Map<String, dynamic> json) {
    return DashboardStatsModel(
      totalStudents: json['totalStudents'] as int? ?? 0,
      totalTeachers: json['totalTeachers'] as int? ?? 0,
      totalStaff: json['totalStaff'] as int? ?? 0,
      totalParents: json['totalParents'] as int? ?? 0,
      todayAttendance: (json['todayAttendance'] as num?)?.toDouble() ?? 0,
      totalFeeCollected: (json['totalFeeCollected'] as num?)?.toDouble() ?? 0,
      totalFeePending: (json['totalFeePending'] as num?)?.toDouble() ?? 0,
      upcomingExams: json['upcomingExams'] as int? ?? 0,
      recentAdmissions: json['recentAdmissions'] as int? ?? 0,
      newNotifications: json['newNotifications'] as int? ?? 0,
      birthdays: json['birthdays'] as int? ?? 0,
    );
  }

  DashboardStats toEntity() {
    return DashboardStats(
      totalStudents: totalStudents,
      totalTeachers: totalTeachers,
      totalStaff: totalStaff,
      totalParents: totalParents,
      todayAttendance: todayAttendance,
      totalFeeCollected: totalFeeCollected,
      totalFeePending: totalFeePending,
      upcomingExams: upcomingExams,
      recentAdmissions: recentAdmissions,
      newNotifications: newNotifications,
      birthdays: birthdays,
    );
  }
}

class CampusStatsModel {
  final String campusName;
  final int studentCount;
  final int teacherCount;

  const CampusStatsModel({
    required this.campusName,
    this.studentCount = 0,
    this.teacherCount = 0,
  });

  factory CampusStatsModel.fromJson(Map<String, dynamic> json) {
    return CampusStatsModel(
      campusName: json['campusName'] as String? ?? '',
      studentCount: json['studentCount'] as int? ?? 0,
      teacherCount: json['teacherCount'] as int? ?? 0,
    );
  }

  CampusStats toEntity() {
    return CampusStats(
      campusName: campusName,
      studentCount: studentCount,
      teacherCount: teacherCount,
    );
  }
}

class ChartDataModel {
  final String label;
  final double value;

  const ChartDataModel({required this.label, required this.value});

  factory ChartDataModel.fromJson(Map<String, dynamic> json) {
    return ChartDataModel(
      label: json['label'] as String? ?? '',
      value: (json['value'] as num?)?.toDouble() ?? 0,
    );
  }

  ChartData toEntity() => ChartData(label: label, value: value);
}
