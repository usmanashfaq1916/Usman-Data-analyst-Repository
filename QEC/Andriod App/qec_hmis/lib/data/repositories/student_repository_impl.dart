import 'package:dartz/dartz.dart';
import '../../core/errors/exceptions.dart';
import '../../core/errors/failures.dart';
import '../../domain/entities/student.dart';
import '../../domain/repositories/student_repository.dart';
import '../datasources/student_remote_datasource.dart';

class StudentRepositoryImpl implements StudentRepository {
  final StudentRemoteDataSource _remoteDataSource;

  StudentRepositoryImpl(this._remoteDataSource);

  @override
  Future<Either<Failure, List<Student>>> getStudents({
    int page = 1,
    int limit = 20,
    String? search,
    String? campusId,
    String? departmentId,
    String? status,
  }) async {
    try {
      final models = await _remoteDataSource.getStudents(
        page: page,
        limit: limit,
        search: search,
        campusId: campusId,
        departmentId: departmentId,
        status: status,
      );
      return Right(models.map((m) => m.toEntity()).toList());
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message, statusCode: e.statusCode));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, Student>> getStudent(String id) async {
    try {
      final model = await _remoteDataSource.getStudent(id);
      return Right(model.toEntity());
    } on ServerException catch (e) {
      return Left(NotFoundFailure(message: e.message, statusCode: e.statusCode));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, Student>> createStudent(Student student) async {
    try {
      final model = await _remoteDataSource.createStudent(
        StudentModel.fromEntity(student),
      );
      return Right(model.toEntity());
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message, statusCode: e.statusCode));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, Student>> updateStudent(Student student) async {
    try {
      final model = await _remoteDataSource.updateStudent(
        StudentModel.fromEntity(student),
      );
      return Right(model.toEntity());
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message, statusCode: e.statusCode));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> deleteStudent(String id) async {
    try {
      await _remoteDataSource.deleteStudent(id);
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message, statusCode: e.statusCode));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, Student>> transferCampus(
    String studentId,
    String campusId,
  ) async {
    return const Left(ServerFailure(message: 'Not implemented'));
  }

  @override
  Future<Either<Failure, Student>> promoteStudent(
    String studentId,
    String classId,
  ) async {
    return const Left(ServerFailure(message: 'Not implemented'));
  }

  @override
  Future<Either<Failure, String>> generateQrCode(String studentId) async {
    try {
      final qr = await _remoteDataSource.generateQrCode(studentId);
      return Right(qr);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}
