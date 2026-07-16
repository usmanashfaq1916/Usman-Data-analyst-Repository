import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/network/dio_client.dart';
import '../../data/datasources/attendance_remote_datasource.dart';
import '../../data/repositories/attendance_repository_impl.dart';
import '../../domain/entities/attendance.dart';
import '../../domain/repositories/attendance_repository.dart';

final attendanceRepositoryProvider = Provider<AttendanceRepository>((ref) {
  final dioClient = ref.read(dioClientProvider);
  return AttendanceRepositoryImpl(AttendanceRemoteDataSource(dioClient));
});

class AttendanceState {
  final List<Attendance> attendanceList;
  final AttendanceStats? stats;
  final DateTime selectedDate;
  final bool isLoading;
  final String? error;

  const AttendanceState({
    this.attendanceList = const [],
    this.stats,
    this.selectedDate,
    this.isLoading = false,
    this.error,
  }) : selectedDate = selectedDate ?? DateTime.now();

  AttendanceState copyWith({
    List<Attendance>? attendanceList,
    AttendanceStats? stats,
    DateTime? selectedDate,
    bool? isLoading,
    String? error,
  }) {
    return AttendanceState(
      attendanceList: attendanceList ?? this.attendanceList,
      stats: stats ?? this.stats,
      selectedDate: selectedDate ?? this.selectedDate,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class AttendanceNotifier extends StateNotifier<AttendanceState> {
  final AttendanceRepository _repository;

  AttendanceNotifier(this._repository) : super(const AttendanceState());

  Future<void> loadAttendance({DateTime? date, String? classId}) async {
    state = state.copyWith(isLoading: true, error: null, selectedDate: date ?? state.selectedDate);
    final result = await _repository.getAttendance(
      date: date ?? state.selectedDate,
      classId: classId,
    );
    result.fold(
      (failure) => state = state.copyWith(isLoading: false, error: failure.message),
      (list) => state = state.copyWith(isLoading: false, attendanceList: list),
    );
  }

  Future<void> markAttendance(Attendance attendance) async {
    final result = await _repository.markAttendance(attendance);
    result.fold(
      (failure) => state = state.copyWith(error: failure.message),
      (_) => loadAttendance(),
    );
  }

  Future<void> markBulk(List<Attendance> list) async {
    state = state.copyWith(isLoading: true);
    final result = await _repository.markBulkAttendance(list);
    result.fold(
      (failure) => state = state.copyWith(isLoading: false, error: failure.message),
      (_) => loadAttendance(),
    );
  }

  Future<void> loadStats(DateTime start, DateTime end, {String? classId}) async {
    final result = await _repository.getAttendanceStats(
      startDate: start,
      endDate: end,
      classId: classId,
    );
    result.fold(
      (_) {},
      (stats) => state = state.copyWith(stats: stats),
    );
  }

  void toggleStatus(int index, AttendanceStatus status) {
    if (index < state.attendanceList.length) {
      final updated = state.attendanceList[index].copyWith(status: status);
      final list = [...state.attendanceList];
      list[index] = updated;
      state = state.copyWith(attendanceList: list);
    }
  }
}

final attendanceProvider =
    StateNotifierProvider<AttendanceNotifier, AttendanceState>((ref) {
  return AttendanceNotifier(ref.read(attendanceRepositoryProvider));
});
