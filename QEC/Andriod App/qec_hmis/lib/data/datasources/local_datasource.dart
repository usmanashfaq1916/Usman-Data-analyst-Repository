import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../models/user_model.dart';

class LocalDataSource {
  final FlutterSecureStorage _secureStorage;
  static const String _userKey = 'cached_user';
  static const String _themeKey = 'theme_mode';
  static const String _rememberMeKey = 'remember_me';

  LocalDataSource(this._secureStorage);

  Future<void> cacheUser(UserModel user) async {
    await _secureStorage.write(
      key: _userKey,
      value: jsonEncode(user.toJson()),
    );
  }

  Future<UserModel?> getCachedUser() async {
    final json = await _secureStorage.read(key: _userKey);
    if (json != null) {
      return UserModel.fromJson(jsonDecode(json));
    }
    return null;
  }

  Future<void> clearUser() async {
    await _secureStorage.delete(key: _userKey);
  }

  Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    await _secureStorage.write(key: 'access_token', value: accessToken);
    await _secureStorage.write(key: 'refresh_token', value: refreshToken);
  }

  Future<String?> getAccessToken() async {
    return _secureStorage.read(key: 'access_token');
  }

  Future<String?> getRefreshToken() async {
    return _secureStorage.read(key: 'refresh_token');
  }

  Future<void> clearTokens() async {
    await _secureStorage.delete(key: 'access_token');
    await _secureStorage.delete(key: 'refresh_token');
  }

  Future<void> setThemeMode(bool isDark) async {
    await _secureStorage.write(key: _themeKey, value: isDark.toString());
  }

  Future<bool> getThemeMode() async {
    final value = await _secureStorage.read(key: _themeKey);
    return value == 'true';
  }

  Future<void> setRememberMe(bool value) async {
    await _secureStorage.write(key: _rememberMeKey, value: value.toString());
  }

  Future<bool> getRememberMe() async {
    final value = await _secureStorage.read(key: _rememberMeKey);
    return value == 'true';
  }

  Future<void> clearAll() async {
    await _secureStorage.deleteAll();
  }

  Future<void> cacheData(String key, dynamic data) async {
    final box = await Hive.openBox('cache');
    await box.put(key, jsonEncode(data));
  }

  Future<dynamic> getCachedData(String key) async {
    final box = await Hive.openBox('cache');
    final data = box.get(key);
    if (data != null) {
      return jsonDecode(data);
    }
    return null;
  }

  Future<void> clearCache() async {
    final box = await Hive.openBox('cache');
    await box.clear();
  }
}
