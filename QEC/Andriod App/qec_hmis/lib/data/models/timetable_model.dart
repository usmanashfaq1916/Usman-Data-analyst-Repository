import '../../domain/entities/timetable.dart';

class TimetableModel {
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

  const TimetableModel({
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

  factory TimetableModel.fromJson(Map<String, dynamic> json) {
    return TimetableModel(
      id: json['id'] as String? ?? '',
      dayOfWeek: json['dayOfWeek'] as String? ?? '',
      startTime: json['startTime'] as String? ?? '',
      endTime: json['endTime'] as String? ?? '',
      courseName: json['courseName'] as String?,
      teacherName: json['teacherName'] as String?,
      room: json['room'] as String?,
      campusId: json['campusId'] as String?,
      classId: json['classId'] as String?,
      section: json['section'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'dayOfWeek': dayOfWeek,
    'startTime': startTime,
    'endTime': endTime,
    'courseName': courseName,
    'teacherName': teacherName,
    'room': room,
    'campusId': campusId,
    'classId': classId,
    'section': section,
  };

  TimetableEntry toEntity() {
    return TimetableEntry(
      id: id,
      dayOfWeek: dayOfWeek,
      startTime: startTime,
      endTime: endTime,
      courseName: courseName,
      teacherName: teacherName,
      room: room,
      campusId: campusId,
      classId: classId,
      section: section,
    );
  }
}
