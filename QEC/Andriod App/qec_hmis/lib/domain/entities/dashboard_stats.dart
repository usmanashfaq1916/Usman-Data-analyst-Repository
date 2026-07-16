import 'package:equatable/equatable.dart';

class DashboardStats extends Equatable {
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

  const DashboardStats({
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

  @override
  List<Object?> get props => [
    totalStudents,
    totalTeachers,
    totalStaff,
    totalFeeCollected,
    totalFeePending,
  ];
}

class CampusStats extends Equatable {
  final String campusName;
  final int studentCount;
  final int teacherCount;

  const CampusStats({
    required this.campusName,
    this.studentCount = 0,
    this.teacherCount = 0,
  });

  @override
  List<Object?> get props => [campusName, studentCount];
}

class ChartData extends Equatable {
  final String label;
  final double value;

  const ChartData({required this.label, required this.value});

  @override
  List<Object?> get props => [label, value];
}
