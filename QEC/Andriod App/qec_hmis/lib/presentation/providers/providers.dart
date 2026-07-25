import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/network/dio_client.dart';
import '../../core/network/network_info.dart';
import '../../data/datasources/local_datasource.dart';
import '../../core/constants/api_constants.dart';

final secureStorageProvider = Provider<FlutterSecureStorage>((ref) {
  return const FlutterSecureStorage();
});

final localDataSourceProvider = Provider<LocalDataSource>((ref) {
  return LocalDataSource(ref.read(secureStorageProvider));
});

final dioClientProvider = Provider<DioClient>((ref) {
  return DioClient(
    storage: ref.read(secureStorageProvider),
    baseUrl: ApiConstants.baseUrl,
  );
});

final connectivityProvider = Provider<Connectivity>((ref) {
  return Connectivity();
});

final networkInfoProvider = Provider<NetworkInfo>((ref) {
  return NetworkInfo(ref.read(connectivityProvider));
});
