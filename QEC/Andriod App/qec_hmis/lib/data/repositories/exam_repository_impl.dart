import 'package:dartz/dartz.dart';
import '../../core/errors/exceptions.dart';
import '../../core/errors/failures.dart';
import '../../domain/entities/exam.dart';
import '../../domain/repositories/exam_repository.dart';
import '../datasources/exam_remote_datasource.dart';

class ExamRepositoryImpl implements ExamRepository {
  final ExamRemoteDataSource _remoteDataSource;

  ExamRepositoryImpl(this._remoteDataSource);

  @override
  Future<Either<Failure, List<Exam>>> getExams({
    String? courseId,
    String? classId,
    bool? upcoming,
  }) async {
    try {
      final models = await _remoteDataSource.getExams(
        courseId: courseId,
        classId: classId,
        upcoming: upcoming,
      );
      return Right(models.map((m) => m.toEntity()).toList());
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message, statusCode: e.statusCode));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, Exam>> getExam(String id) async {
    try {
      final model = await _remoteDataSource.getExam(id);
      return Right(model.toEntity());
    } on ServerException catch (e) {
      return Left(NotFoundFailure(message: e.message, statusCode: e.statusCode));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, Exam>> createExam(Exam exam) async {
    try {
      final model = await _remoteDataSource.createExam(
        ExamModel(
          id: '',
          name: exam.name,
          type: exam.type,
          courseId: exam.courseId,
          courseName: exam.courseName,
          totalMarks: exam.totalMarks,
          passMarks: exam.passMarks,
          examDate: exam.examDate.toIso8601String(),
          startTime: exam.startTime?.toIso8601String(),
          endTime: exam.endTime?.toIso8601String(),
          isActive: exam.isActive,
        ),
      );
      return Right(model.toEntity());
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message, statusCode: e.statusCode));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, Exam>> updateExam(Exam exam) async {
    return const Left(ServerFailure(message: 'Not implemented'));
  }

  @override
  Future<Either<Failure, void>> deleteExam(String id) async {
    return const Left(ServerFailure(message: 'Not implemented'));
  }

  @override
  Future<Either<Failure, List<ExamResult>>> getExamResults(String examId) async {
    try {
      final models = await _remoteDataSource.getExamResults(examId);
      return Right(models.map((m) => m.toEntity()).toList());
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> submitMarks(List<ExamResult> results) async {
    try {
      await _remoteDataSource.submitMarks(
        results
            .map((r) => ExamResultModel(
                  id: r.id,
                  examId: r.examId,
                  examName: r.examName,
                  studentId: r.studentId,
                  studentName: r.studentName,
                  rollNumber: r.rollNumber,
                  marks: r.marks,
                  grade: r.grade,
                  remarks: r.remarks,
                  totalMarks: r.totalMarks,
                ))
            .toList(),
      );
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> publishResults(String examId) async {
    try {
      await _remoteDataSource.publishResults(examId);
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, String>> generateReportCard(
    String studentId,
    String semesterId,
  ) async {
    return const Left(ServerFailure(message: 'Not implemented'));
  }
}
