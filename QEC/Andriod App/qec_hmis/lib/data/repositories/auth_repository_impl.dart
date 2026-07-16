import 'package:dartz/dartz.dart';
import '../../core/errors/exceptions.dart';
import '../../core/errors/failures.dart';
import '../../core/network/network_info.dart';
import '../../domain/entities/user.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_remote_datasource.dart';
import '../datasources/local_datasource.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource _remoteDataSource;
  final LocalDataSource _localDataSource;
  final NetworkInfo _networkInfo;

  AuthRepositoryImpl({
    required AuthRemoteDataSource remoteDataSource,
    required LocalDataSource localDataSource,
    required NetworkInfo networkInfo,
  })  : _remoteDataSource = remoteDataSource,
        _localDataSource = localDataSource,
        _networkInfo = networkInfo;

  @override
  Future<Either<Failure, User>> login(String email, String password) async {
    try {
      if (await _networkInfo.isConnected) {
        final userModel = await _remoteDataSource.login(email, password);
        await _localDataSource.cacheUser(userModel);
        return Right(userModel.toEntity());
      } else {
        final cached = await _localDataSource.getCachedUser();
        if (cached != null) {
          return Right(cached.toEntity());
        }
        return const Left(NetworkFailure());
      }
    } on AuthException catch (e) {
      return Left(AuthFailure(message: e.message, statusCode: e.statusCode));
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message, statusCode: e.statusCode));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, User>> loginWithPhone(String phone, String password) async {
    try {
      final userModel = await _remoteDataSource.loginWithPhone(phone, password);
      await _localDataSource.cacheUser(userModel);
      return Right(userModel.toEntity());
    } on AuthException catch (e) {
      return Left(AuthFailure(message: e.message, statusCode: e.statusCode));
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message, statusCode: e.statusCode));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> sendOtp(String phone) async {
    try {
      await _remoteDataSource.sendOtp(phone);
      return const Right(null);
    } on AuthException catch (e) {
      return Left(AuthFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, User>> verifyOtp(String phone, String otp) async {
    try {
      final userModel = await _remoteDataSource.verifyOtp(phone, otp);
      await _localDataSource.cacheUser(userModel);
      return Right(userModel.toEntity());
    } on AuthException catch (e) {
      return Left(AuthFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> forgotPassword(String email) async {
    try {
      await _remoteDataSource.forgotPassword(email);
      return const Right(null);
    } on AuthException catch (e) {
      return Left(AuthFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> resetPassword(String token, String password) async {
    try {
      return const Right(null);
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, User>> getProfile() async {
    try {
      if (await _networkInfo.isConnected) {
        final userModel = await _remoteDataSource.getProfile();
        await _localDataSource.cacheUser(userModel);
        return Right(userModel.toEntity());
      }
      final cached = await _localDataSource.getCachedUser();
      if (cached != null) return Right(cached.toEntity());
      return const Left(NetworkFailure());
    } on AuthException catch (e) {
      return Left(AuthFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> updateProfile(User user) async {
    try {
      return const Right(null);
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> logout() async {
    try {
      await _localDataSource.clearAll();
      return const Right(null);
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, bool>> isLoggedIn() async {
    try {
      final token = await _localDataSource.getAccessToken();
      return Right(token != null);
    } catch (e) {
      return const Right(false);
    }
  }

  @override
  Future<Either<Failure, bool>> checkBiometric() async {
    try {
      return const Right(false);
    } catch (e) {
      return const Right(false);
    }
  }

  @override
  Future<Either<Failure, User>> loginWithBiometric() async {
    try {
      final cached = await _localDataSource.getCachedUser();
      if (cached != null) return Right(cached.toEntity());
      return const Left(AuthFailure(message: 'No cached user found'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}
