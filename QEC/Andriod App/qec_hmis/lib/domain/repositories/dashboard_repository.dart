import 'package:dartz/dartz.dart';
import '../../core/errors/failures.dart';
import '../entities/dashboard_stats.dart';

abstract class DashboardRepository {
  Future<Either<Failure, DashboardStats>> getStats();
  Future<Either<Failure, List<CampusStats>>> getCampusStats();
  Future<Either<Failure, List<ChartData>>> getStudentGrowthChart({int months = 6});
  Future<Either<Failure, List<ChartData>>> getFeeCollectionChart({int months = 6});
  Future<Either<Failure, List<ChartData>>> getAttendanceChart({int days = 30});
  Future<Either<Failure, List<ChartData>>> getGenderRatio();
}
