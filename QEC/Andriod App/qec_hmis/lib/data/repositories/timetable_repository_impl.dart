import 'package:dartz/dartz.dart';
import '../../core/errors/exceptions.dart';
import '../../core/errors/failures.dart';
import '../../domain/entities/timetable.dart';
import '../../domain/repositories/timetable_repository.dart';
import '../datasources/timetable_remote_datasource.dart';

class TimetableRepositoryImpl implements TimetableRepository {
  final TimetableRemoteDataSource _remoteDataSource;

  TimetableRepositoryImpl(this._remoteDataSource);

  @override
  Future<Either<Failure, List<TimetableEntry>>> getTimetable({
    String? classId,
    String? campusId,
    String? dayOfWeek,
  }) async {
    try {
      final models = await _remoteDataSource.getTimetable(
        classId: classId,
        campusId: campusId,
        dayOfWeek: dayOfWeek,
      );
      return Right(models.map((m) => m.toEntity()).toList());
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message, statusCode: e.statusCode));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}
