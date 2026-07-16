import '../../core/errors/exceptions.dart';
import '../../core/network/dio_client.dart';
import '../models/user_model.dart';
import '../../core/constants/api_constants.dart';

class AuthRemoteDataSource {
  final DioClient _client;

  AuthRemoteDataSource(this._client);

  Future<UserModel> login(String email, String password) async {
    final response = await _client.post(
      ApiConstants.login,
      data: {'email': email, 'password': password},
    );
    if (response.statusCode == 200) {
      return UserModel.fromJson(response.data['user']);
    }
    throw AuthException(message: response.data['message'] ?? 'Login failed');
  }

  Future<UserModel> loginWithPhone(String phone, String password) async {
    final response = await _client.post(
      ApiConstants.login,
      data: {'phone': phone, 'password': password},
    );
    if (response.statusCode == 200) {
      return UserModel.fromJson(response.data['user']);
    }
    throw AuthException(message: response.data['message'] ?? 'Login failed');
  }

  Future<void> sendOtp(String phone) async {
    final response = await _client.post(
      ApiConstants.verifyOtp,
      data: {'phone': phone},
    );
    if (response.statusCode != 200) {
      throw AuthException(message: response.data['message'] ?? 'Failed to send OTP');
    }
  }

  Future<UserModel> verifyOtp(String phone, String otp) async {
    final response = await _client.post(
      ApiConstants.verifyOtp,
      data: {'phone': phone, 'otp': otp},
    );
    if (response.statusCode == 200) {
      return UserModel.fromJson(response.data['user']);
    }
    throw AuthException(message: response.data['message'] ?? 'OTP verification failed');
  }

  Future<void> forgotPassword(String email) async {
    final response = await _client.post(
      ApiConstants.forgotPassword,
      data: {'email': email},
    );
    if (response.statusCode != 200) {
      throw AuthException(message: response.data['message'] ?? 'Failed');
    }
  }

  Future<UserModel> getProfile() async {
    final response = await _client.get(ApiConstants.profile);
    if (response.statusCode == 200) {
      return UserModel.fromJson(response.data['user']);
    }
    throw AuthException(message: 'Failed to get profile');
  }

  Future<void> updateProfile(UserModel user) async {
    final response = await _client.put(
      ApiConstants.profile,
      data: user.toJson(),
    );
    if (response.statusCode != 200) {
      throw AuthException(message: 'Failed to update profile');
    }
  }
}
