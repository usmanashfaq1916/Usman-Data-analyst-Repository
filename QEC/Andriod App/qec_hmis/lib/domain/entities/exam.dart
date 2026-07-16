import 'package:equatable/equatable.dart';

class Exam extends Equatable {
  final String id;
  final String name;
  final String type;
  final String? courseId;
  final String? courseName;
  final int totalMarks;
  final int passMarks;
  final DateTime examDate;
  final DateTime? startTime;
  final DateTime? endTime;
  final bool isActive;

  const Exam({
    required this.id,
    required this.name,
    required this.type,
    this.courseId,
    this.courseName,
    this.totalMarks = 100,
    this.passMarks = 40,
    required this.examDate,
    this.startTime,
    this.endTime,
    this.isActive = true,
  });

  @override
  List<Object?> get props => [id, name, examDate];
}

class ExamResult extends Equatable {
  final String id;
  final String examId;
  final String? examName;
  final String studentId;
  final String? studentName;
  final String? rollNumber;
  final double marks;
  final String? grade;
  final String? remarks;
  final int totalMarks;

  const ExamResult({
    required this.id,
    required this.examId,
    this.examName,
    required this.studentId,
    this.studentName,
    this.rollNumber,
    required this.marks,
    this.grade,
    this.remarks,
    this.totalMarks = 100,
  });

  double get percentage => totalMarks > 0 ? (marks / totalMarks) * 100 : 0;
  bool get isPassed => marks >= (totalMarks * 0.4);

  @override
  List<Object?> get props => [id, examId, studentId, marks];
}
