import 'package:dartz/dartz.dart';
import '../../core/errors/failures.dart';
import '../entities/hostel.dart';

abstract class HostelRepository {
  Future<Either<Failure, List<Hostel>>> getHostels({String? campusId});
}
