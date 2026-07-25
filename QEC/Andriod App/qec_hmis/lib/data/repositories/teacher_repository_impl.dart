import 'package:dartz/dartz.dart';
import '../../core/errors/exceptions.dart';
import '../../core/errors/failures.dart';
import '../../domain/entities/teacher.dart';
import '../../domain/repositories/teacher_repository.dart';
import '../datasources/teacher_remote_datasource.dart';

class TeacherRepositoryImpl implements TeacherRepository {
  final TeacherRemoteDataSource _remoteDataSource;

  TeacherRepositoryImpl(this._remoteDataSource);

  @override
  Future<Either<Failure, List<Teacher>>> getTeachers({
    int page = 1,
    int limit = 20,
    String? search,
    String? campusId,
    String? departmentId,
  }) async {
    try {
      final models = await _remoteDataSource.getTeachers(
        page: page,
        limit: limit,
        search: search,
        campusId: campusId,
        departmentId: departmentId,
      );
      return Right(models.map((m) => m.toEntity()).toList());
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message, statusCode: e.statusCode));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, Teacher>> getTeacher(String id) async {
    try {
      final model = await _remoteDataSource.getTeacher(id);
      return Right(model.toEntity());
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message, statusCode: e.statusCode));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}
