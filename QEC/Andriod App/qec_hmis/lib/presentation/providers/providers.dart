import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/network/dio_client.dart';
import '../../core/network/network_info.dart';
import '../../data/datasources/local_datasource.dart';

final secureStorageProvider = Provider<FlutterSecureStorage>((ref) {
  return const FlutterSecureStorage();
});

final localDataSourceProvider = Provider<LocalDataSource>((ref) {
  return LocalDataSource(ref.read(secureStorageProvider));
});

final dioClientProvider = Provider<DioClient>((ref) {
  return DioClient(storage: ref.read(secureStorageProvider));
});

final connectivityProvider = Provider<Connectivity>((ref) {
  return Connectivity();
});

final networkInfoProvider = Provider<NetworkInfo>((ref) {
  return NetworkInfo(ref.read(connectivityProvider));
});
