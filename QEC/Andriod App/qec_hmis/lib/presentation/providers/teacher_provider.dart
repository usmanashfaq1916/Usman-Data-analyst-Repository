import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/datasources/teacher_remote_datasource.dart';
import '../../data/repositories/teacher_repository_impl.dart';
import '../../domain/entities/teacher.dart';
import '../../domain/repositories/teacher_repository.dart';
import 'providers.dart';

final teacherRepositoryProvider = Provider<TeacherRepository>((ref) {
  final dioClient = ref.read(dioClientProvider);
  return TeacherRepositoryImpl(
    TeacherRemoteDataSource(dioClient),
  );
});

class TeacherState {
  final List<Teacher> teachers;
  final Teacher? selectedTeacher;
  final bool isLoading;
  final String? error;
  final int currentPage;
  final bool hasMore;
  final String searchQuery;

  const TeacherState({
    this.teachers = const [],
    this.selectedTeacher,
    this.isLoading = false,
    this.error,
    this.currentPage = 1,
    this.hasMore = true,
    this.searchQuery = '',
  });

  TeacherState copyWith({
    List<Teacher>? teachers,
    Teacher? selectedTeacher,
    bool? isLoading,
    String? error,
    int? currentPage,
    bool? hasMore,
    String? searchQuery,
  }) {
    return TeacherState(
      teachers: teachers ?? this.teachers,
      selectedTeacher: selectedTeacher ?? this.selectedTeacher,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      currentPage: currentPage ?? this.currentPage,
      hasMore: hasMore ?? this.hasMore,
      searchQuery: searchQuery ?? this.searchQuery,
    );
  }
}

class TeacherNotifier extends StateNotifier<TeacherState> {
  final TeacherRepository _repository;

  TeacherNotifier(this._repository) : super(const TeacherState());

  Future<void> loadTeachers({bool refresh = false}) async {
    if (refresh) {
      state = state.copyWith(teachers: [], currentPage: 1, hasMore: true);
    }
    if (!state.hasMore || state.isLoading) return;

    state = state.copyWith(isLoading: true, error: null);

    final result = await _repository.getTeachers(
      page: state.currentPage,
      search: state.searchQuery.isNotEmpty ? state.searchQuery : null,
    );

    result.fold(
      (failure) => state = state.copyWith(isLoading: false, error: failure.message),
      (teachers) {
        final allTeachers = [...state.teachers, ...teachers];
        state = state.copyWith(
          teachers: allTeachers,
          isLoading: false,
          currentPage: state.currentPage + 1,
          hasMore: teachers.length >= 20,
        );
      },
    );
  }

  Future<void> searchTeachers(String query) async {
    state = state.copyWith(searchQuery: query, teachers: [], currentPage: 1);
    await loadTeachers();
  }

  Future<void> loadTeacher(String id) async {
    state = state.copyWith(isLoading: true, error: null);
    final result = await _repository.getTeacher(id);
    result.fold(
      (failure) => state = state.copyWith(isLoading: false, error: failure.message),
      (teacher) => state = state.copyWith(isLoading: false, selectedTeacher: teacher),
    );
  }
}

final teacherProvider = StateNotifierProvider<TeacherNotifier, TeacherState>((ref) {
  return TeacherNotifier(ref.read(teacherRepositoryProvider));
});
