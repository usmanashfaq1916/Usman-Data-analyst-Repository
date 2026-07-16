import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/network/dio_client.dart';
import '../../data/datasources/dashboard_remote_datasource.dart';
import '../../data/repositories/dashboard_repository_impl.dart';
import '../../domain/entities/dashboard_stats.dart';
import '../../domain/repositories/dashboard_repository.dart';

final dashboardRepositoryProvider = Provider<DashboardRepository>((ref) {
  final dioClient = ref.read(dioClientProvider);
  return DashboardRepositoryImpl(DashboardRemoteDataSource(dioClient));
});

class DashboardState {
  final DashboardStats? stats;
  final List<CampusStats> campusStats;
  final List<ChartData> studentGrowth;
  final List<ChartData> feeCollection;
  final List<ChartData> attendance;
  final bool isLoading;
  final String? error;

  const DashboardState({
    this.stats,
    this.campusStats = const [],
    this.studentGrowth = const [],
    this.feeCollection = const [],
    this.attendance = const [],
    this.isLoading = false,
    this.error,
  });

  DashboardState copyWith({
    DashboardStats? stats,
    List<CampusStats>? campusStats,
    List<ChartData>? studentGrowth,
    List<ChartData>? feeCollection,
    List<ChartData>? attendance,
    bool? isLoading,
    String? error,
  }) {
    return DashboardState(
      stats: stats ?? this.stats,
      campusStats: campusStats ?? this.campusStats,
      studentGrowth: studentGrowth ?? this.studentGrowth,
      feeCollection: feeCollection ?? this.feeCollection,
      attendance: attendance ?? this.attendance,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class DashboardNotifier extends StateNotifier<DashboardState> {
  final DashboardRepository _repository;

  DashboardNotifier(this._repository) : super(const DashboardState());

  Future<void> loadDashboard() async {
    state = state.copyWith(isLoading: true, error: null);

    final statsResult = await _repository.getStats();
    statsResult.fold(
      (failure) => state = state.copyWith(isLoading: false, error: failure.message),
      (stats) => state = state.copyWith(stats: stats),
    );

    final campusResult = await _repository.getCampusStats();
    campusResult.fold(
      (_) {},
      (stats) => state = state.copyWith(campusStats: stats),
    );

    final growthResult = await _repository.getStudentGrowthChart();
    growthResult.fold(
      (_) {},
      (data) => state = state.copyWith(studentGrowth: data),
    );

    final feeResult = await _repository.getFeeCollectionChart();
    feeResult.fold(
      (_) {},
      (data) => state = state.copyWith(feeCollection: data),
    );

    state = state.copyWith(isLoading: false);
  }
}

final dashboardProvider =
    StateNotifierProvider<DashboardNotifier, DashboardState>((ref) {
  return DashboardNotifier(ref.read(dashboardRepositoryProvider));
});
