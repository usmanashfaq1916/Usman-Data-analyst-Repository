import 'package:dartz/dartz.dart';
import '../../core/errors/failures.dart';
import '../entities/attendance.dart';

abstract class AttendanceRepository {
  Future<Either<Failure, List<Attendance>>> getAttendance({
    required DateTime date,
    String? classId,
    String? courseId,
  });
  Future<Either<Failure, void>> markAttendance(Attendance attendance);
  Future<Either<Failure, void>> markBulkAttendance(List<Attendance> attendanceList);
  Future<Either<Failure, AttendanceStats>> getAttendanceStats({
    required DateTime startDate,
    required DateTime endDate,
    String? classId,
    String? studentId,
  });
  Future<Either<Failure, List<Attendance>>> getStudentAttendance(
    String studentId, {
    required DateTime startDate,
    required DateTime endDate,
  });
}
