import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/exam.dart';

part 'exam_model.g.dart';

@JsonSerializable()
class ExamModel {
  final String id;
  final String name;
  final String type;
  final String? courseId;
  final String? courseName;
  final int totalMarks;
  final int passMarks;
  final String examDate;
  final String? startTime;
  final String? endTime;
  final bool isActive;

  const ExamModel({
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

  factory ExamModel.fromJson(Map<String, dynamic> json) => _$ExamModelFromJson(json);
  Map<String, dynamic> toJson() => _$ExamModelToJson(this);

  Exam toEntity() {
    return Exam(
      id: id,
      name: name,
      type: type,
      courseId: courseId,
      courseName: courseName,
      totalMarks: totalMarks,
      passMarks: passMarks,
      examDate: DateTime.parse(examDate),
      startTime: startTime != null ? DateTime.parse(startTime!) : null,
      endTime: endTime != null ? DateTime.parse(endTime!) : null,
      isActive: isActive,
    );
  }
}

@JsonSerializable()
class ExamResultModel {
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

  const ExamResultModel({
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

  factory ExamResultModel.fromJson(Map<String, dynamic> json) =>
      _$ExamResultModelFromJson(json);
  Map<String, dynamic> toJson() => _$ExamResultModelToJson(this);

  ExamResult toEntity() {
    return ExamResult(
      id: id,
      examId: examId,
      examName: examName,
      studentId: studentId,
      studentName: studentName,
      rollNumber: rollNumber,
      marks: marks,
      grade: grade,
      remarks: remarks,
      totalMarks: totalMarks,
    );
  }
}
