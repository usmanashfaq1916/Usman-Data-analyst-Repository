import 'package:dartz/dartz.dart';
import '../../core/errors/failures.dart';
import '../entities/exam.dart';

abstract class ExamRepository {
  Future<Either<Failure, List<Exam>>> getExams({
    String? courseId,
    String? classId,
    bool? upcoming,
  });
  Future<Either<Failure, Exam>> getExam(String id);
  Future<Either<Failure, Exam>> createExam(Exam exam);
  Future<Either<Failure, Exam>> updateExam(Exam exam);
  Future<Either<Failure, void>> deleteExam(String id);
  Future<Either<Failure, List<ExamResult>>> getExamResults(String examId);
  Future<Either<Failure, void>> submitMarks(List<ExamResult> results);
  Future<Either<Failure, void>> publishResults(String examId);
  Future<Either<Failure, String>> generateReportCard(String studentId, String semesterId);
}
