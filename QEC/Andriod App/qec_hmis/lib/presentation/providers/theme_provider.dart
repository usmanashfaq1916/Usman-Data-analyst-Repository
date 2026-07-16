import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/datasources/local_datasource.dart';

final themeModeProvider =
    StateNotifierProvider<ThemeNotifier, ThemeMode>((ref) {
  final localDataSource = ref.read(localDataSourceProvider);
  return ThemeNotifier(localDataSource);
});

class ThemeNotifier extends StateNotifier<ThemeMode> {
  final LocalDataSource _localDataSource;

  ThemeNotifier(this._localDataSource) : super(ThemeMode.light) {
    _loadTheme();
  }

  Future<void> _loadTheme() async {
    final isDark = await _localDataSource.getThemeMode();
    state = isDark ? ThemeMode.dark : ThemeMode.light;
  }

  Future<void> toggleTheme() async {
    state = state == ThemeMode.light ? ThemeMode.dark : ThemeMode.light;
    await _localDataSource.setThemeMode(state == ThemeMode.dark);
  }

  Future<void> setTheme(ThemeMode mode) async {
    state = mode;
    await _localDataSource.setThemeMode(mode == ThemeMode.dark);
  }
}
