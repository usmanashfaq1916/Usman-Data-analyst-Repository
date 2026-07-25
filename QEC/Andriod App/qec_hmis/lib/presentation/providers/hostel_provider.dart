import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/datasources/hostel_remote_datasource.dart';
import '../../data/repositories/hostel_repository_impl.dart';
import '../../domain/entities/hostel.dart';
import '../../domain/repositories/hostel_repository.dart';
import 'providers.dart';

final hostelRepositoryProvider = Provider<HostelRepository>((ref) {
  return HostelRepositoryImpl(
    HostelRemoteDataSource(ref.read(dioClientProvider)),
  );
});

class HostelState {
  final List<Hostel> hostels;
  final bool isLoading;
  final String? error;

  const HostelState({
    this.hostels = const [],
    this.isLoading = false,
    this.error,
  });

  HostelState copyWith({
    List<Hostel>? hostels,
    bool? isLoading,
    String? error,
  }) {
    return HostelState(
      hostels: hostels ?? this.hostels,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class HostelNotifier extends StateNotifier<HostelState> {
  final HostelRepository _repository;

  HostelNotifier(this._repository) : super(const HostelState());

  Future<void> loadHostels({String? campusId}) async {
    state = state.copyWith(isLoading: true, error: null);
    final result = await _repository.getHostels(campusId: campusId);
    result.fold(
      (failure) => state = state.copyWith(isLoading: false, error: failure.message),
      (hostels) => state = state.copyWith(isLoading: false, hostels: hostels),
    );
  }
}

final hostelProvider = StateNotifierProvider<HostelNotifier, HostelState>((ref) {
  return HostelNotifier(ref.read(hostelRepositoryProvider));
});
