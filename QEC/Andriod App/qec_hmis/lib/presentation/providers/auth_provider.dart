import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/network/dio_client.dart';
import '../../core/network/network_info.dart';
import '../../core/errors/failures.dart';
import '../../data/datasources/auth_remote_datasource.dart';
import '../../data/datasources/local_datasource.dart';
import '../../data/repositories/auth_repository_impl.dart';
import '../../domain/entities/user.dart';
import '../../domain/repositories/auth_repository.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final dioClient = ref.read(dioClientProvider);
  final localDataSource = ref.read(localDataSourceProvider);
  final networkInfo = ref.read(networkInfoProvider);
  final remoteDataSource = AuthRemoteDataSource(dioClient);
  return AuthRepositoryImpl(
    remoteDataSource: remoteDataSource,
    localDataSource: localDataSource,
    networkInfo: networkInfo,
  );
});

enum AuthStatus { unknown, authenticated, unauthenticated }

class AuthState {
  final AuthStatus status;
  final User? user;
  final bool isLoading;
  final String? error;
  final bool isBiometricAvailable;

  const AuthState({
    this.status = AuthStatus.unknown,
    this.user,
    this.isLoading = false,
    this.error,
    this.isBiometricAvailable = false,
  });

  AuthState copyWith({
    AuthStatus? status,
    User? user,
    bool? isLoading,
    String? error,
    bool? isBiometricAvailable,
  }) {
    return AuthState(
      status: status ?? this.status,
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      isBiometricAvailable: isBiometricAvailable ?? this.isBiometricAvailable,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepository _repository;

  AuthNotifier(this._repository) : super(const AuthState());

  Future<void> checkAuth() async {
    final result = await _repository.isLoggedIn();
    result.fold(
      (failure) => state = state.copyWith(status: AuthStatus.unauthenticated),
      (isLoggedIn) {
        if (isLoggedIn) {
          _loadUser();
        } else {
          state = state.copyWith(status: AuthStatus.unauthenticated);
        }
      },
    );
  }

  Future<void> _loadUser() async {
    final result = await _repository.getProfile();
    result.fold(
      (failure) => state = state.copyWith(
        status: AuthStatus.unauthenticated,
        error: failure.message,
      ),
      (user) => state = state.copyWith(
        status: AuthStatus.authenticated,
        user: user,
      ),
    );
  }

  Future<void> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    final result = await _repository.login(email, password);
    result.fold(
      (failure) => state = state.copyWith(
        isLoading: false,
        error: failure.message,
        status: AuthStatus.unauthenticated,
      ),
      (user) => state = state.copyWith(
        isLoading: false,
        user: user,
        status: AuthStatus.authenticated,
        error: null,
      ),
    );
  }

  Future<void> loginWithPhone(String phone, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    final result = await _repository.loginWithPhone(phone, password);
    result.fold(
      (failure) => state = state.copyWith(
        isLoading: false,
        error: failure.message,
      ),
      (user) => state = state.copyWith(
        isLoading: false,
        user: user,
        status: AuthStatus.authenticated,
        error: null,
      ),
    );
  }

  Future<void> sendOtp(String phone) async {
    state = state.copyWith(isLoading: true, error: null);
    final result = await _repository.sendOtp(phone);
    result.fold(
      (failure) => state = state.copyWith(isLoading: false, error: failure.message),
      (_) => state = state.copyWith(isLoading: false),
    );
  }

  Future<void> verifyOtp(String phone, String otp) async {
    state = state.copyWith(isLoading: true, error: null);
    final result = await _repository.verifyOtp(phone, otp);
    result.fold(
      (failure) => state = state.copyWith(isLoading: false, error: failure.message),
      (user) => state = state.copyWith(
        isLoading: false,
        user: user,
        status: AuthStatus.authenticated,
      ),
    );
  }

  Future<void> logout() async {
    await _repository.logout();
    state = const AuthState(status: AuthStatus.unauthenticated);
  }

  void clearError() {
    state = state.copyWith(error: null);
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref.read(authRepositoryProvider));
});
