import 'package:dartz/dartz.dart';
import '../../core/errors/failures.dart';
import '../entities/timetable.dart';

abstract class TimetableRepository {
  Future<Either<Failure, List<TimetableEntry>>> getTimetable({
    String? classId,
    String? campusId,
    String? dayOfWeek,
  });
}
