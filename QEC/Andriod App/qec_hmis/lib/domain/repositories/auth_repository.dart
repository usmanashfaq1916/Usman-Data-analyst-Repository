import 'package:dartz/dartz.dart';
import '../../core/errors/failures.dart';
import '../entities/user.dart';

abstract class AuthRepository {
  Future<Either<Failure, User>> login(String email, String password);
  Future<Either<Failure, User>> loginWithPhone(String phone, String password);
  Future<Either<Failure, void>> sendOtp(String phone);
  Future<Either<Failure, User>> verifyOtp(String phone, String otp);
  Future<Either<Failure, void>> forgotPassword(String email);
  Future<Either<Failure, void>> resetPassword(String token, String password);
  Future<Either<Failure, User>> getProfile();
  Future<Either<Failure, void>> updateProfile(User user);
  Future<Either<Failure, void>> logout();
  Future<Either<Failure, bool>> isLoggedIn();
  Future<Either<Failure, bool>> checkBiometric();
  Future<Either<Failure, User>> loginWithBiometric();
}
