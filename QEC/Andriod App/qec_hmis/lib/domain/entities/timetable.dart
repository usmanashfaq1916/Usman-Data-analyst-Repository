import 'package:equatable/equatable.dart';

class TimetableEntry extends Equatable {
  final String id;
  final String dayOfWeek;
  final String startTime;
  final String endTime;
  final String? courseName;
  final String? teacherName;
  final String? room;
  final String? campusId;
  final String? classId;
  final String? section;

  const TimetableEntry({
    required this.id,
    required this.dayOfWeek,
    required this.startTime,
    required this.endTime,
    this.courseName,
    this.teacherName,
    this.room,
    this.campusId,
    this.classId,
    this.section,
  });

  @override
  List<Object?> get props => [id, dayOfWeek, startTime, courseName];
}
