import 'package:dartz/dartz.dart';
import '../../core/errors/failures.dart';
import '../entities/teacher.dart';

abstract class TeacherRepository {
  Future<Either<Failure, List<Teacher>>> getTeachers({
    int page = 1,
    int limit = 20,
    String? search,
    String? campusId,
    String? departmentId,
  });
  Future<Either<Failure, Teacher>> getTeacher(String id);
}
