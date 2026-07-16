import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/network/dio_client.dart';
import '../../data/datasources/fee_remote_datasource.dart';
import '../../data/repositories/fee_repository_impl.dart';
import '../../domain/entities/fee.dart';
import '../../domain/repositories/fee_repository.dart';

final feeRepositoryProvider = Provider<FeeRepository>((ref) {
  final dioClient = ref.read(dioClientProvider);
  return FeeRepositoryImpl(FeeRemoteDataSource(dioClient));
});

class FeeState {
  final List<Fee> fees;
  final FeeCollection? collection;
  final bool isLoading;
  final String? error;

  const FeeState({
    this.fees = const [],
    this.collection,
    this.isLoading = false,
    this.error,
  });

  FeeState copyWith({
    List<Fee>? fees,
    FeeCollection? collection,
    bool? isLoading,
    String? error,
  }) {
    return FeeState(
      fees: fees ?? this.fees,
      collection: collection ?? this.collection,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class FeeNotifier extends StateNotifier<FeeState> {
  final FeeRepository _repository;

  FeeNotifier(this._repository) : super(const FeeState());

  Future<void> loadFees({String? studentId, String? status}) async {
    state = state.copyWith(isLoading: true, error: null);
    final result = await _repository.getFees(studentId: studentId, status: status);
    result.fold(
      (failure) => state = state.copyWith(isLoading: false, error: failure.message),
      (fees) => state = state.copyWith(isLoading: false, fees: fees),
    );
  }

  Future<void> collectFee(String feeId, double amount, String method) async {
    state = state.copyWith(isLoading: true, error: null);
    final result = await _repository.collectFee(feeId, amount, method);
    result.fold(
      (failure) => state = state.copyWith(isLoading: false, error: failure.message),
      (_) {
        state = state.copyWith(isLoading: false);
        loadFees();
      },
    );
  }

  Future<void> loadFeeStats() async {
    final result = await _repository.getFeeCollectionStats();
    result.fold(
      (_) {},
      (collection) => state = state.copyWith(collection: collection),
    );
  }
}

final feeProvider = StateNotifierProvider<FeeNotifier, FeeState>((ref) {
  return FeeNotifier(ref.read(feeRepositoryProvider));
});
