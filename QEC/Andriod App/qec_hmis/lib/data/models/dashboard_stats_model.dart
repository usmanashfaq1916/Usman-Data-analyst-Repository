import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/dashboard_stats.dart';

part 'dashboard_stats_model.g.dart';

@JsonSerializable()
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

  factory DashboardStatsModel.fromJson(Map<String, dynamic> json) =>
      _$DashboardStatsModelFromJson(json);

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

@JsonSerializable()
class CampusStatsModel {
  final String campusName;
  final int studentCount;
  final int teacherCount;

  const CampusStatsModel({
    required this.campusName,
    this.studentCount = 0,
    this.teacherCount = 0,
  });

  factory CampusStatsModel.fromJson(Map<String, dynamic> json) =>
      _$CampusStatsModelFromJson(json);

  CampusStats toEntity() {
    return CampusStats(
      campusName: campusName,
      studentCount: studentCount,
      teacherCount: teacherCount,
    );
  }
}

@JsonSerializable()
class ChartDataModel {
  final String label;
  final double value;

  const ChartDataModel({required this.label, required this.value});

  factory ChartDataModel.fromJson(Map<String, dynamic> json) =>
      _$ChartDataModelFromJson(json);

  ChartData toEntity() => ChartData(label: label, value: value);
}
