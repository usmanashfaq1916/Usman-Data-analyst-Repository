import 'package:dartz/dartz.dart';
import '../../core/errors/exceptions.dart';
import '../../core/errors/failures.dart';
import '../../domain/entities/fee.dart';
import '../../domain/repositories/fee_repository.dart';
import '../datasources/fee_remote_datasource.dart';
import '../models/fee_model.dart';

class FeeRepositoryImpl implements FeeRepository {
  final FeeRemoteDataSource _remoteDataSource;

  FeeRepositoryImpl(this._remoteDataSource);

  @override
  Future<Either<Failure, List<Fee>>> getFees({
    int page = 1,
    String? studentId,
    String? status,
    String? type,
  }) async {
    try {
      final models = await _remoteDataSource.getFees(
        page: page,
        studentId: studentId,
        status: status,
        type: type,
      );
      return Right(models.map((m) => m.toEntity()).toList());
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message, statusCode: e.statusCode));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, Fee>> getFee(String id) async {
    try {
      final model = await _remoteDataSource.getFee(id);
      return Right(model.toEntity());
    } on ServerException catch (e) {
      return Left(NotFoundFailure(message: e.message, statusCode: e.statusCode));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, Fee>> createFee(Fee fee) async {
    try {
      final model = await _remoteDataSource.createFee(
        FeeModel(
          id: '',
          studentId: fee.studentId,
          studentName: fee.studentName,
          rollNumber: fee.rollNumber,
          type: fee.type,
          amount: fee.amount,
          paidAmount: 0,
          status: 'PENDING',
          dueDate: fee.dueDate?.toIso8601String(),
          createdAt: DateTime.now().toIso8601String(),
        ),
      );
      return Right(model.toEntity());
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message, statusCode: e.statusCode));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, Fee>> collectFee(
    String feeId,
    double amount,
    String paymentMethod,
  ) async {
    try {
      final model = await _remoteDataSource.collectFee(feeId, amount, paymentMethod);
      return Right(model.toEntity());
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, FeeCollection>> getFeeCollectionStats({
    DateTime? startDate,
    DateTime? endDate,
    String? campusId,
  }) async {
    try {
      final model = await _remoteDataSource.getFeeCollectionStats(
        startDate: startDate,
        endDate: endDate,
        campusId: campusId,
      );
      return Right(model.toEntity());
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, String>> generateChallan(String feeId) async {
    try {
      final url = await _remoteDataSource.generateChallan(feeId);
      return Right(url);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<Fee>>> getStudentFees(String studentId) async {
    try {
      final models = await _remoteDataSource.getStudentFees(studentId);
      return Right(models.map((m) => m.toEntity()).toList());
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> applyDiscount(
    String feeId,
    double discount,
    String reason,
  ) async {
    try {
      await _remoteDataSource.applyDiscount(feeId, discount, reason);
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> applyScholarship(
    String studentId,
    double percentage,
  ) async {
    try {
      await _remoteDataSource.applyScholarship(studentId, percentage);
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}
