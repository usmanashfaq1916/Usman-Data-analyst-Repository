import 'package:dartz/dartz.dart';
import '../../core/errors/exceptions.dart';
import '../../core/errors/failures.dart';
import '../../domain/entities/transport.dart';
import '../../domain/repositories/transport_repository.dart';
import '../datasources/transport_remote_datasource.dart';

class TransportRepositoryImpl implements TransportRepository {
  final TransportRemoteDataSource _remoteDataSource;

  TransportRepositoryImpl(this._remoteDataSource);

  @override
  Future<Either<Failure, List<BusRoute>>> getRoutes({
    String? campusId,
    String? status,
  }) async {
    try {
      final models = await _remoteDataSource.getRoutes(
        campusId: campusId,
        status: status,
      );
      return Right(models.map((m) => m.toEntity()).toList());
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message, statusCode: e.statusCode));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}
