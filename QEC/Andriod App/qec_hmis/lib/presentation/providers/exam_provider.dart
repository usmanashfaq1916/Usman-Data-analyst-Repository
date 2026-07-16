import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/network/dio_client.dart';
import '../../data/datasources/exam_remote_datasource.dart';
import '../../data/repositories/exam_repository_impl.dart';
import '../../domain/entities/exam.dart';
import '../../domain/repositories/exam_repository.dart';

final examRepositoryProvider = Provider<ExamRepository>((ref) {
  final dioClient = ref.read(dioClientProvider);
  return ExamRepositoryImpl(ExamRemoteDataSource(dioClient));
});

class ExamState {
  final List<Exam> exams;
  final Exam? selectedExam;
  final List<ExamResult> examResults;
  final bool isLoading;
  final String? error;

  const ExamState({
    this.exams = const [],
    this.selectedExam,
    this.examResults = const [],
    this.isLoading = false,
    this.error,
  });

  ExamState copyWith({
    List<Exam>? exams,
    Exam? selectedExam,
    List<ExamResult>? examResults,
    bool? isLoading,
    String? error,
  }) {
    return ExamState(
      exams: exams ?? this.exams,
      selectedExam: selectedExam ?? this.selectedExam,
      examResults: examResults ?? this.examResults,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class ExamNotifier extends StateNotifier<ExamState> {
  final ExamRepository _repository;

  ExamNotifier(this._repository) : super(const ExamState());

  Future<void> loadExams({bool? upcoming}) async {
    state = state.copyWith(isLoading: true, error: null);
    final result = await _repository.getExams(upcoming: upcoming);
    result.fold(
      (failure) => state = state.copyWith(isLoading: false, error: failure.message),
      (exams) => state = state.copyWith(isLoading: false, exams: exams),
    );
  }

  Future<void> loadExamResults(String examId) async {
    state = state.copyWith(isLoading: true, error: null);
    final result = await _repository.getExamResults(examId);
    result.fold(
      (failure) => state = state.copyWith(isLoading: false, error: failure.message),
      (results) => state = state.copyWith(isLoading: false, examResults: results),
    );
  }

  Future<void> submitMarks(List<ExamResult> results) async {
    state = state.copyWith(isLoading: true);
    final result = await _repository.submitMarks(results);
    result.fold(
      (failure) => state = state.copyWith(isLoading: false, error: failure.message),
      (_) => state = state.copyWith(isLoading: false),
    );
  }

  Future<void> createExam(Exam exam) async {
    state = state.copyWith(isLoading: true, error: null);
    final result = await _repository.createExam(exam);
    result.fold(
      (failure) => state = state.copyWith(isLoading: false, error: failure.message),
      (_) {
        state = state.copyWith(isLoading: false);
        loadExams();
      },
    );
  }
}

final examProvider = StateNotifierProvider<ExamNotifier, ExamState>((ref) {
  return ExamNotifier(ref.read(examRepositoryProvider));
});
