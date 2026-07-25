import 'package:dartz/dartz.dart';
import '../../core/errors/failures.dart';
import '../entities/transport.dart';

abstract class TransportRepository {
  Future<Either<Failure, List<BusRoute>>> getRoutes({
    String? campusId,
    String? status,
  });
}
