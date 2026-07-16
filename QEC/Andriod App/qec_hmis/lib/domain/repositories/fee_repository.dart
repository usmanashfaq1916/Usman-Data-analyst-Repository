import 'package:dartz/dartz.dart';
import '../../core/errors/failures.dart';
import '../entities/fee.dart';

abstract class FeeRepository {
  Future<Either<Failure, List<Fee>>> getFees({
    int page = 1,
    String? studentId,
    String? status,
    String? type,
  });
  Future<Either<Failure, Fee>> getFee(String id);
  Future<Either<Failure, Fee>> createFee(Fee fee);
  Future<Either<Failure, Fee>> collectFee(String feeId, double amount, String paymentMethod);
  Future<Either<Failure, FeeCollection>> getFeeCollectionStats({
    DateTime? startDate,
    DateTime? endDate,
    String? campusId,
  });
  Future<Either<Failure, String>> generateChallan(String feeId);
  Future<Either<Failure, List<Fee>>> getStudentFees(String studentId);
  Future<Either<Failure, void>> applyDiscount(String feeId, double discount, String reason);
  Future<Either<Failure, void>> applyScholarship(String studentId, double percentage);
}
