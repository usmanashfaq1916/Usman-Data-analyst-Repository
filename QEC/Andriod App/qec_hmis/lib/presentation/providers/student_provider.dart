import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/network/dio_client.dart';
import '../../data/datasources/student_remote_datasource.dart';
import '../../data/repositories/student_repository_impl.dart';
import '../../domain/entities/student.dart';
import '../../domain/repositories/student_repository.dart';

final studentRepositoryProvider = Provider<StudentRepository>((ref) {
  final dioClient = ref.read(dioClientProvider);
  return StudentRepositoryImpl(StudentRemoteDataSource(dioClient));
});

class StudentState {
  final List<Student> students;
  final Student? selectedStudent;
  final bool isLoading;
  final String? error;
  final int currentPage;
  final bool hasMore;
  final String searchQuery;

  const StudentState({
    this.students = const [],
    this.selectedStudent,
    this.isLoading = false,
    this.error,
    this.currentPage = 1,
    this.hasMore = true,
    this.searchQuery = '',
  });

  StudentState copyWith({
    List<Student>? students,
    Student? selectedStudent,
    bool? isLoading,
    String? error,
    int? currentPage,
    bool? hasMore,
    String? searchQuery,
  }) {
    return StudentState(
      students: students ?? this.students,
      selectedStudent: selectedStudent ?? this.selectedStudent,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      currentPage: currentPage ?? this.currentPage,
      hasMore: hasMore ?? this.hasMore,
      searchQuery: searchQuery ?? this.searchQuery,
    );
  }
}

class StudentNotifier extends StateNotifier<StudentState> {
  final StudentRepository _repository;

  StudentNotifier(this._repository) : super(const StudentState());

  Future<void> loadStudents({bool refresh = false}) async {
    if (refresh) {
      state = state.copyWith(students: [], currentPage: 1, hasMore: true);
    }
    if (!state.hasMore || state.isLoading) return;

    state = state.copyWith(isLoading: true, error: null);

    final result = await _repository.getStudents(
      page: state.currentPage,
      search: state.searchQuery.isNotEmpty ? state.searchQuery : null,
    );

    result.fold(
      (failure) => state = state.copyWith(isLoading: false, error: failure.message),
      (students) {
        final allStudents = [...state.students, ...students];
        state = state.copyWith(
          students: allStudents,
          isLoading: false,
          currentPage: state.currentPage + 1,
          hasMore: students.length >= 20,
        );
      },
    );
  }

  Future<void> searchStudents(String query) async {
    state = state.copyWith(searchQuery: query, students: [], currentPage: 1);
    await loadStudents();
  }

  Future<void> loadStudent(String id) async {
    state = state.copyWith(isLoading: true, error: null);
    final result = await _repository.getStudent(id);
    result.fold(
      (failure) => state = state.copyWith(isLoading: false, error: failure.message),
      (student) => state = state.copyWith(isLoading: false, selectedStudent: student),
    );
  }

  Future<String?> generateQrCode(String studentId) async {
    final result = await _repository.generateQrCode(studentId);
    return result.fold((failure) => null, (qr) => qr);
  }
}

final studentProvider = StateNotifierProvider<StudentNotifier, StudentState>((ref) {
  return StudentNotifier(ref.read(studentRepositoryProvider));
});
