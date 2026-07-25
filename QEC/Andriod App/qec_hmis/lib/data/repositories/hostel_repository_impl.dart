import 'package:dartz/dartz.dart';
import '../../core/errors/exceptions.dart';
import '../../core/errors/failures.dart';
import '../../domain/entities/hostel.dart';
import '../../domain/repositories/hostel_repository.dart';
import '../datasources/hostel_remote_datasource.dart';

class HostelRepositoryImpl implements HostelRepository {
  final HostelRemoteDataSource _remoteDataSource;

  HostelRepositoryImpl(this._remoteDataSource);

  @override
  Future<Either<Failure, List<Hostel>>> getHostels({String? campusId}) async {
    try {
      final models = await _remoteDataSource.getHostels(campusId: campusId);
      return Right(models.map((m) => m.toEntity()).toList());
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message, statusCode: e.statusCode));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}
