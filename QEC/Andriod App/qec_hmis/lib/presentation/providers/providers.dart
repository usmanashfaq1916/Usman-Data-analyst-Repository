import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/network/dio_client.dart';
import '../../core/network/network_info.dart';
import '../../data/datasources/local_datasource.dart';
import '../../core/constants/api_constants.dart';

final sharedPrefsProvider = Provider<SharedPreferences>((ref) {
  throw UnimplementedError('Must be overridden in main.dart');
});

final localDataSourceProvider = Provider<LocalDataSource>((ref) {
  return LocalDataSource(ref.read(sharedPrefsProvider));
});

final dioClientProvider = Provider<DioClient>((ref) {
  return DioClient(
    prefs: ref.read(sharedPrefsProvider),
    baseUrl: ApiConstants.baseUrl,
  );
});

final connectivityProvider = Provider<Connectivity>((ref) {
  return Connectivity();
});

final networkInfoProvider = Provider<NetworkInfo>((ref) {
  return NetworkInfo(ref.read(connectivityProvider));
});
