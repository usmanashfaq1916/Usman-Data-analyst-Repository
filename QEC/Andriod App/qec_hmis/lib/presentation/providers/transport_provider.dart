import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/datasources/transport_remote_datasource.dart';
import '../../data/repositories/transport_repository_impl.dart';
import '../../domain/entities/transport.dart';
import '../../domain/repositories/transport_repository.dart';
import 'providers.dart';

final transportRepositoryProvider = Provider<TransportRepository>((ref) {
  return TransportRepositoryImpl(
    TransportRemoteDataSource(ref.read(dioClientProvider)),
  );
});

class TransportState {
  final List<BusRoute> routes;
  final bool isLoading;
  final String? error;

  const TransportState({
    this.routes = const [],
    this.isLoading = false,
    this.error,
  });

  TransportState copyWith({
    List<BusRoute>? routes,
    bool? isLoading,
    String? error,
  }) {
    return TransportState(
      routes: routes ?? this.routes,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class TransportNotifier extends StateNotifier<TransportState> {
  final TransportRepository _repository;

  TransportNotifier(this._repository) : super(const TransportState());

  Future<void> loadRoutes({String? campusId}) async {
    state = state.copyWith(isLoading: true, error: null);
    final result = await _repository.getRoutes(campusId: campusId);
    result.fold(
      (failure) => state = state.copyWith(isLoading: false, error: failure.message),
      (routes) => state = state.copyWith(isLoading: false, routes: routes),
    );
  }
}

final transportProvider = StateNotifierProvider<TransportNotifier, TransportState>((ref) {
  return TransportNotifier(ref.read(transportRepositoryProvider));
});
