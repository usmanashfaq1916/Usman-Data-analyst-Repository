import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../models/user_model.dart';

class LocalDataSource {
  final SharedPreferences _prefs;
  static const String _userKey = 'cached_user';
  static const String _themeKey = 'theme_mode';
  static const String _rememberMeKey = 'remember_me';

  LocalDataSource(this._prefs);

  Future<void> cacheUser(UserModel user) async {
    await _prefs.setString(_userKey, jsonEncode(user.toJson()));
  }

  Future<UserModel?> getCachedUser() async {
    final json = _prefs.getString(_userKey);
    if (json != null) {
      return UserModel.fromJson(jsonDecode(json));
    }
    return null;
  }

  Future<void> clearUser() async {
    await _prefs.remove(_userKey);
  }

  Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    await _prefs.setString('access_token', accessToken);
    await _prefs.setString('refresh_token', refreshToken);
  }

  Future<String?> getAccessToken() async {
    return _prefs.getString('access_token');
  }

  Future<String?> getRefreshToken() async {
    return _prefs.getString('refresh_token');
  }

  Future<void> clearTokens() async {
    await _prefs.remove('access_token');
    await _prefs.remove('refresh_token');
  }

  Future<void> setThemeMode(bool isDark) async {
    await _prefs.setString(_themeKey, isDark.toString());
  }

  Future<bool> getThemeMode() async {
    final value = _prefs.getString(_themeKey);
    return value == 'true';
  }

  Future<void> setRememberMe(bool value) async {
    await _prefs.setString(_rememberMeKey, value.toString());
  }

  Future<bool> getRememberMe() async {
    final value = _prefs.getString(_rememberMeKey);
    return value == 'true';
  }

  Future<void> clearAll() async {
    await _prefs.clear();
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
