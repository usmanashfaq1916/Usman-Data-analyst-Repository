import 'package:dartz/dartz.dart';
import '../../core/errors/failures.dart';
import '../entities/student.dart';

abstract class StudentRepository {
  Future<Either<Failure, List<Student>>> getStudents({
    int page = 1,
    int limit = 20,
    String? search,
    String? campusId,
    String? departmentId,
    String? status,
  });
  Future<Either<Failure, Student>> getStudent(String id);
  Future<Either<Failure<Student>, Student>> createStudent(Student student);
  Future<Either<Failure, Student>> updateStudent(Student student);
  Future<Either<Failure, void>> deleteStudent(String id);
  Future<Either<Failure, Student>> transferCampus(String studentId, String campusId);
  Future<Either<Failure, Student>> promoteStudent(String studentId, String classId);
  Future<Either<Failure, String>> generateQrCode(String studentId);
}
