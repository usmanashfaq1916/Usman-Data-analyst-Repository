import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/datasources/timetable_remote_datasource.dart';
import '../../data/repositories/timetable_repository_impl.dart';
import '../../domain/entities/timetable.dart';
import '../../domain/repositories/timetable_repository.dart';
import 'providers.dart';

final timetableRepositoryProvider = Provider<TimetableRepository>((ref) {
  return TimetableRepositoryImpl(
    TimetableRemoteDataSource(ref.read(dioClientProvider)),
  );
});

class TimetableState {
  final List<TimetableEntry> entries;
  final String selectedDay;
  final bool isLoading;
  final String? error;

  const TimetableState({
    this.entries = const [],
    this.selectedDay = 'MONDAY',
    this.isLoading = false,
    this.error,
  });

  TimetableState copyWith({
    List<TimetableEntry>? entries,
    String? selectedDay,
    bool? isLoading,
    String? error,
  }) {
    return TimetableState(
      entries: entries ?? this.entries,
      selectedDay: selectedDay ?? this.selectedDay,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class TimetableNotifier extends StateNotifier<TimetableState> {
  final TimetableRepository _repository;

  TimetableNotifier(this._repository) : super(const TimetableState());

  Future<void> loadTimetable({String? classId, String? campusId}) async {
    state = state.copyWith(isLoading: true, error: null);
    final result = await _repository.getTimetable(
      classId: classId,
      campusId: campusId,
      dayOfWeek: state.selectedDay,
    );
    result.fold(
      (failure) => state = state.copyWith(isLoading: false, error: failure.message),
      (entries) => state = state.copyWith(isLoading: false, entries: entries),
    );
  }

  void setDay(String day) {
    state = state.copyWith(selectedDay: day);
  }
}

final timetableProvider = StateNotifierProvider<TimetableNotifier, TimetableState>((ref) {
  return TimetableNotifier(ref.read(timetableRepositoryProvider));
});
