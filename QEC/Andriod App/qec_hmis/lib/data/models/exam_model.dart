import '../../domain/entities/exam.dart';

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

  factory ExamModel.fromJson(Map<String, dynamic> json) {
    return ExamModel(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      type: json['type'] as String? ?? '',
      courseId: json['courseId'] as String?,
      courseName: json['courseName'] as String?,
      totalMarks: json['totalMarks'] as int? ?? 100,
      passMarks: json['passMarks'] as int? ?? 40,
      examDate: json['examDate'] as String? ?? DateTime.now().toIso8601String(),
      startTime: json['startTime'] as String?,
      endTime: json['endTime'] as String?,
      isActive: json['isActive'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'type': type,
    'courseId': courseId,
    'courseName': courseName,
    'totalMarks': totalMarks,
    'passMarks': passMarks,
    'examDate': examDate,
    'startTime': startTime,
    'endTime': endTime,
    'isActive': isActive,
  };

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

  factory ExamResultModel.fromJson(Map<String, dynamic> json) {
    return ExamResultModel(
      id: json['id'] as String? ?? '',
      examId: json['examId'] as String? ?? '',
      examName: json['examName'] as String?,
      studentId: json['studentId'] as String? ?? '',
      studentName: json['studentName'] as String?,
      rollNumber: json['rollNumber'] as String?,
      marks: (json['marks'] as num?)?.toDouble() ?? 0,
      grade: json['grade'] as String?,
      remarks: json['remarks'] as String?,
      totalMarks: json['totalMarks'] as int? ?? 100,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'examId': examId,
    'examName': examName,
    'studentId': studentId,
    'studentName': studentName,
    'rollNumber': rollNumber,
    'marks': marks,
    'grade': grade,
    'remarks': remarks,
    'totalMarks': totalMarks,
  };

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
