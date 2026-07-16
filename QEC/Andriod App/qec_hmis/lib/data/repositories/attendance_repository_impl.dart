import 'package:dartz/dartz.dart';
import '../../core/errors/exceptions.dart';
import '../../core/errors/failures.dart';
import '../../domain/entities/attendance.dart';
import '../../domain/repositories/attendance_repository.dart';
import '../datasources/attendance_remote_datasource.dart';

class AttendanceRepositoryImpl implements AttendanceRepository {
  final AttendanceRemoteDataSource _remoteDataSource;

  AttendanceRepositoryImpl(this._remoteDataSource);

  @override
  Future<Either<Failure, List<Attendance>>> getAttendance({
    required DateTime date,
    String? classId,
    String? courseId,
  }) async {
    try {
      final models = await _remoteDataSource.getAttendance(
        date: date,
        classId: classId,
        courseId: courseId,
      );
      return Right(models.map((m) => m.toEntity()).toList());
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message, statusCode: e.statusCode));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> markAttendance(Attendance attendance) async {
    try {
      await _remoteDataSource.markAttendance(
        AttendanceModel.fromEntity(attendance),
      );
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> markBulkAttendance(
    List<Attendance> attendanceList,
  ) async {
    try {
      await _remoteDataSource.markBulkAttendance(
        attendanceList.map((a) => AttendanceModel.fromEntity(a)).toList(),
      );
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, AttendanceStats>> getAttendanceStats({
    required DateTime startDate,
    required DateTime endDate,
    String? classId,
    String? studentId,
  }) async {
    try {
      final model = await _remoteDataSource.getAttendanceStats(
        startDate: startDate,
        endDate: endDate,
        classId: classId,
        studentId: studentId,
      );
      return Right(model.toEntity());
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<Attendance>>> getStudentAttendance(
    String studentId, {
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    return getAttendance(
      date: DateTime.now(),
      courseId: null,
    );
  }
}
